import React, { useState, useRef, useEffect, useMemo } from 'react';
import './Hero.css';

const Hero = ({ focusTrigger }) => {
    // iPhone State: 'upload', 'history', 'access', 'profile', 'login'
    const [screen, setScreen] = useState('login');
    const [uploadStatus, setUploadStatus] = useState('idle');
    const [uploadPreview, setUploadPreview] = useState(null);
    const [activeAlert, setActiveAlert] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [highlightMockup, setHighlightMockup] = useState(false);
    const [localTrigger, setLocalTrigger] = useState(0);
    const [uploadType, setUploadType] = useState('prescription');
    const fileInputRef = useRef(null);

    // Trigger highlight when focusTrigger or localTrigger changes
    useEffect(() => {
        if (focusTrigger > 0 || localTrigger > 0) {
            setHighlightMockup(true);
            const timer = setTimeout(() => {
                setHighlightMockup(false);
            }, 6000); // Highlight for 6 seconds
            return () => clearTimeout(timer);
        }
    }, [focusTrigger, localTrigger]);

    // Fix mobile viewport height jump
    useEffect(() => {
        const setHeroHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--hero-height', `${window.innerHeight}px`);
        };

        setHeroHeight();

        // Only update on width change to avoid resize loop on mobile scroll
        let width = window.innerWidth;
        const handleResize = () => {
            if (window.innerWidth !== width) {
                width = window.innerWidth;
                setHeroHeight();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // History Detail State
    const [activeHistoryItem, setActiveHistoryItem] = useState(null);

    const handleHistoryClick = (item) => {
        setActiveHistoryItem(item);
    };

    const handleBackFromHistory = () => {
        setActiveHistoryItem(null);
    };

    const handleLogin = () => {
        setScreen('upload');
    };

    // Mock Access Data (Matches access.tsx / generateMockAccess)
    const [accessRecords, setAccessRecords] = useState([
        { id: '1', clinicName: 'City Medical Center', doctorName: 'Dr. Sarah Wilson', status: 'pending', icon: '🏥' },
        { id: '2', clinicName: 'Health Diagnostics Lab', doctorName: 'Dr. Michael Chen', status: 'active', duration: 'full', icon: '🧪' },
        { id: '3', clinicName: 'Endocrine Care Clinic', doctorName: 'Dr. Jane Smith', status: 'active', duration: '1h', icon: '🩺', expiresSoon: true },
    ]);

    // Mock History Data (Matches historyUtils.ts / generateMockHistory)
    // Mock History Data (Matches historyUtils.ts / generateMockHistory)
    const historyGroups = [
        {
            year: 2026,
            months: [
                {
                    monthLabel: 'February',
                    items: [
                        {
                            id: '1',
                            type: 'prescription',
                            title: 'Digital Prescription',
                            date: '6:05 AM',
                            clinicName: 'City Medical Center',
                            medicines: [{ name: 'Amoxicillin', dosage: '500mg', freq: 'Twice daily', duration: '7 days' }, { name: 'Ibuprofen', dosage: '400mg', freq: 'Every 6 hours', duration: '5 days' }],
                            status: 'active',
                            fullDate: 'Sunday, February 1, 2026',
                            notes: 'Take with food. Complete the full course.'
                        }
                    ]
                },
                {
                    monthLabel: 'January',
                    items: [
                        { id: '2', type: 'lab', title: 'Electronic Lab Report', date: 'Fri', clinicName: 'Health Diagnostics Lab', medicines: [{ name: 'Hemoglobin' }, { name: 'RBC' }, { name: 'WBC' }], status: 'completed', fullDate: 'Friday, January 24, 2026' },
                        { id: '3', type: 'prescription', title: 'Digital Prescription', date: 'Jan 15', clinicName: 'Endocrine Care Clinic', medicines: [{ name: 'Metformin' }], status: 'active', fullDate: 'Wednesday, January 15, 2026' }
                    ]
                }
            ]
        }
    ];

    // Memoized filtered history
    const filteredHistory = useMemo(() => {
        return historyGroups.map(yearGroup => ({
            ...yearGroup,
            months: yearGroup.months.map(month => ({
                ...month,
                items: month.items.filter(item => {
                    // Type Filter
                    const matchesType = selectedFilter === 'all' || item.type === selectedFilter;

                    // Search Filter
                    const query = searchQuery.toLowerCase().trim();
                    const matchesSearch = !query ||
                        item.clinicName.toLowerCase().includes(query) ||
                        item.title.toLowerCase().includes(query) ||
                        (item.medicines && item.medicines.some(m => m.name.toLowerCase().includes(query)));

                    return matchesType && matchesSearch;
                })
            })).filter(month => month.items.length > 0)
        })).filter(yearGroup => yearGroup.months.length > 0);
    }, [searchQuery, selectedFilter]);

    const handleUploadClick = (type = 'prescription') => {
        setUploadType(type);
        fileInputRef.current.click();
    };
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadPreview(reader.result);
                setUploadStatus('uploading');

                setTimeout(() => {
                    setUploadStatus('processing');
                }, 2000);

                setTimeout(() => {
                    setUploadStatus('completed');
                    const isLab = uploadType === 'lab';
                    setActiveAlert({
                        title: "Coming Soon!",
                        message: `MedHive's ${isLab ? 'Lab Analyzer' : 'Prescription Reader'} is Currently in Private Beta. We're Refining the Model to Ensure 99.9% Accuracy Before Public Release.`,
                        confirmText: "Notify Me",
                        onConfirm: () => {
                            setActiveAlert(null);
                            setUploadStatus('idle');
                            setUploadPreview(null);
                        },
                        onCancel: () => {
                            setActiveAlert(null);
                            setUploadStatus('idle');
                            setUploadPreview(null);
                        }
                    });
                }, 5000);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAccessAction = (id, action) => {
        const record = accessRecords.find(r => r.id === id);
        if (!record) return;

        let title = ""; let message = ""; let confirmText = "Confirm";
        if (action === 'approve_1h') {
            title = "Grant Temporary Access?";
            message = `${record.clinicName} will be able to view your medical history for exactly 60 minutes.`;
            confirmText = "Approve for 1 Hour";
        } else if (action === 'approve_full') {
            title = "Grant Full Access?";
            message = `${record.clinicName} will have ongoing access to your history until you revoke it.`;
            confirmText = "Approve Full Access";
        } else if (action === 'revoke') {
            title = "Revoke Access?";
            message = `${record.clinicName} will no longer be able to view your medical records.`;
            confirmText = "Revoke";
        }

        setActiveAlert({
            title, message, confirmText, isDestructive: action === 'revoke',
            onConfirm: () => {
                if (action === 'revoke') setAccessRecords(prev => prev.filter(r => r.id !== id));
                else setAccessRecords(prev => prev.map(r => r.id === id ? {
                    ...r, status: 'active', duration: action === 'approve_1h' ? '1h' : 'full', expiresSoon: action === 'approve_1h'
                } : r));
                setActiveAlert(null);
            }
        });
    };

    const handleGetStartedClick = () => {
        setLocalTrigger(prev => prev + 1);

        if (window.innerWidth <= 900) {
            // Scroll to mockup on mobile
            const element = document.getElementById('hero-mockup-target');
            if (element) {
                const yOffset = -180;
                const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        } else {
            // Scroll to top on desktop
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <section className="hero">
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*,.pdf" onChange={handleFileChange} />
            <div className="hero-gradient" />

            <div className="container hero-container">
                <div className="hero-left animate-fade-in">
                    <h1 className="hero-title">MedHive</h1>
                    <h2 className="hero-moto">Your Health,<br />Unified.</h2>
                    <p className="hero-subtitle">
                        MedHive is Sri Lanka's AI-Powered Healthcare Platform. Unify Medical Records, Digitize Prescriptions, and Access Intelligent Health Insights with Your Med-ID.
                    </p>
                    <div className="hero-buttons">
                        <button className="btn-primary glass-btn" onClick={handleGetStartedClick}>Experience MedHive</button>
                        <button
                            className="btn-secondary glass-btn"
                            onClick={() => {
                                const element = document.getElementById('ai');
                                if (element) {
                                    const yOffset = -20;
                                    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                                    window.scrollTo({ top: y, behavior: 'smooth' });
                                }
                            }}
                        >
                            Learn More
                        </button>
                    </div>
                </div>

                <div className="hero-right animate-slide-in-right" id="hero-mockup-target">
                    {highlightMockup && (
                        <div className="medhive-focus-overlay">
                            Try it!
                        </div>
                    )}

                    <div className={`iphone-mockup ${highlightMockup ? 'focused-mockup' : ''}`}>
                        {/* Hardware Buttons */}
                        <div className="iphone-hw-button action-btn"></div>
                        <div className="iphone-hw-button vol-up"></div>
                        <div className="iphone-hw-button vol-down"></div>
                        <div className="iphone-hw-button side-btn"></div>

                        <div className="iphone-bezel">
                            <div className="iphone-screen">
                                <div className="dynamic-island"></div>
                                <div className="status-bar">
                                    <span>9:41</span>
                                    <div className="status-icons">
                                        <div className="ios-signal">{[1, 2, 3, 4].map(i => <div key={i} className="bar"></div>)}</div>
                                        <div className="ios-battery"><div className="battery-level"></div></div>
                                    </div>
                                </div>

                                { /* App Header removed - now individual per screen */}

                                <div className="app-content-container">
                                    {/* LOGIN SCREEN */}
                                    {screen === 'login' && (
                                        <div className="screen-login animate-fade-in">
                                            <div className="login-logo-container">
                                                <img src="/logode.png" alt="MedHive Logo" className="login-logo-img" width="80" height="80" />
                                            </div>

                                            <h2 className="login-title">Login</h2>

                                            <div className="login-form">
                                                <div className="login-field">
                                                    <label htmlFor="login-email">Email</label>
                                                    <div className="login-input-wrapper">
                                                        <i className="fa-regular fa-envelope"></i>
                                                        <input
                                                            id="login-email"
                                                            name="email"
                                                            type="email"
                                                            placeholder="Enter your email"
                                                            autoComplete="email"
                                                            aria-label="Email Address"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="login-field">
                                                    <label htmlFor="login-password">Password</label>
                                                    <div className="login-input-wrapper">
                                                        <i className="fa-solid fa-lock"></i>
                                                        <input
                                                            id="login-password"
                                                            name="password"
                                                            type="password"
                                                            placeholder="Enter your password"
                                                            autoComplete="current-password"
                                                            aria-label="Password"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="login-forgot" onClick={() => setScreen('forgot_password')} style={{ cursor: 'pointer' }}>Forgot Password?</div>

                                                <button className="btn-login-mockup" onClick={handleLogin}>Sign In</button>
                                            </div>
                                        </div>
                                    )}

                                    {/* FORGOT PASSWORD SCREEN */}
                                    {screen === 'forgot_password' && (
                                        <div className="screen-login animate-fade-in">
                                            <div className="login-logo-container">
                                                <img src="/logode.png" alt="MedHive Logo" className="login-logo-img" width="80" height="80" />
                                            </div>

                                            <h2 className="login-title">Reset Password</h2>
                                            <p className="login-subtitle" style={{ textAlign: 'center', color: '#666', fontSize: '13px', margin: '-10px 20px 20px', lineHeight: '1.4' }}>
                                                Enter your email address to receive a password reset link.
                                            </p>

                                            <div className="login-form">
                                                <div className="login-field">
                                                    <label htmlFor="forgot-email">Email</label>
                                                    <div className="login-input-wrapper">
                                                        <i className="fa-regular fa-envelope"></i>
                                                        <input
                                                            id="forgot-email"
                                                            name="email"
                                                            type="email"
                                                            placeholder="Enter your email"
                                                            autoComplete="email"
                                                            aria-label="Email Address for Password Reset"
                                                        />
                                                    </div>
                                                </div>

                                                <button className="btn-login-mockup" onClick={() => setScreen('login')}>Send Reset Link</button>

                                                <div
                                                    className="login-forgot"
                                                    onClick={() => setScreen('login')}
                                                    style={{ cursor: 'pointer', textAlign: 'center', marginTop: '15px', color: 'var(--color-primary)', fontWeight: '600', alignSelf: 'center' }}
                                                >
                                                    Back to Sign In
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {/* UPLOAD SCREEN */}
                                    {screen === 'upload' && (
                                        <div className="screen-home animate-fade-in">
                                            <div className="home-header">
                                                <h2>Upload</h2>
                                                <div className="profile-circle" onClick={() => setScreen('profile')} style={{ cursor: 'pointer' }}>JD</div>
                                            </div>

                                            <div className="upload-main-card">
                                                <div className="upload-icon-circle">
                                                    <i className="fa-regular fa-file-lines"></i>
                                                </div>
                                                <h3>Upload Your Health Record</h3>
                                                <p>Upload an Image to Extract Medicine Name, Dosage, and Duration</p>

                                                <div className="upload-actions-list">
                                                    <div className="upload-action-item" onClick={() => handleUploadClick('prescription')}>
                                                        <div className="ua-content">
                                                            <h4>Prescription Reader</h4>
                                                            <span>Extract Medicine Details</span>
                                                        </div>
                                                        <i className="fa-solid fa-chevron-right ua-arrow"></i>
                                                    </div>
                                                    <div className="upload-action-item" onClick={() => handleUploadClick('lab')}>
                                                        <div className="ua-content">
                                                            <h4>Lab Report Analyzer</h4>
                                                            <span>Analyze Test Results</span>
                                                        </div>
                                                        <i className="fa-solid fa-chevron-right ua-arrow"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* HISTORY SCREEN */}
                                    {screen === 'history' && !activeHistoryItem && (
                                        <div className="screen-history animate-fade-in">
                                            <div className="home-header">
                                                <h2>History</h2>
                                                <div className="profile-circle" onClick={() => setScreen('profile')} style={{ cursor: 'pointer' }}>JD</div>
                                            </div>

                                            <div className="search-bar-pill">
                                                <i className="fas fa-search"></i>
                                                <input
                                                    type="text"
                                                    placeholder="Search by medicine, doctor, clinic..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    aria-label="Search History"
                                                />
                                                {searchQuery && (
                                                    <i
                                                        className="fas fa-times-circle clear-search"
                                                        onClick={() => setSearchQuery('')}
                                                        style={{ cursor: 'pointer', opacity: 0.6 }}
                                                    ></i>
                                                )}
                                            </div>

                                            <div className="filter-chips-row">
                                                <div
                                                    className={`f-chip ${selectedFilter === 'all' ? 'active' : ''}`}
                                                    onClick={() => setSelectedFilter('all')}
                                                >
                                                    <i className="fa-solid fa-border-all"></i> All
                                                </div>
                                                <div
                                                    className={`f-chip ${selectedFilter === 'prescription' ? 'active' : ''}`}
                                                    onClick={() => setSelectedFilter('prescription')}
                                                >
                                                    <i className="fa-regular fa-file-lines"></i> Prescriptions
                                                </div>
                                                <div
                                                    className={`f-chip ${selectedFilter === 'lab' ? 'active' : ''}`}
                                                    onClick={() => setSelectedFilter('lab')}
                                                >
                                                    <i className="fa-solid fa-flask"></i> Lab Reports
                                                </div>
                                            </div>

                                            {filteredHistory.length === 0 ? (
                                                <div className="empty-history-mockup">
                                                    <i className="fas fa-search"></i>
                                                    <p>No records found for "{searchQuery}"</p>
                                                </div>
                                            ) : (
                                                filteredHistory.map(yearGroup => (
                                                    <div key={yearGroup.year} className="year-container">
                                                        <h3 className="year-title">{yearGroup.year}</h3>
                                                        {yearGroup.months.map(month => (
                                                            <div key={month.monthLabel} className="month-group">
                                                                <div className="month-divider">
                                                                    <span className="line"></span>
                                                                    <span className="month-label">{month.monthLabel}</span>
                                                                    <span className="line"></span>
                                                                </div>
                                                                <div className="history-list">
                                                                    {month.items.map(item => (
                                                                        <div key={item.id} className="history-card" onClick={() => handleHistoryClick(item)}>
                                                                            <div className="hc-left-icon">
                                                                                <i className={`fas ${item.type === 'prescription' ? 'fa-file-invoice' : 'fa-flask'}`}></i>
                                                                            </div>
                                                                            <div className="hc-main-content">
                                                                                <h4>{item.clinicName}</h4>
                                                                                <p>{item.title}</p>
                                                                                {item.medicines && <div className="hc-pill-preview">
                                                                                    <i className="fa-solid fa-asterisk"></i> {item.medicines[0].name} {item.medicines.length > 1 ? `+${item.medicines.length - 1} more` : ''}
                                                                                </div>}
                                                                            </div>
                                                                            <div className="hc-right-date">{item.date}</div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}

                                    {/* HISTORY DETAILS SCREEN */}
                                    {screen === 'history' && activeHistoryItem && (
                                        <div className="screen-history-details animate-slide-in">
                                            <div className="hd-header">
                                                <button className="hd-back-btn" onClick={handleBackFromHistory}>
                                                    <i className="fa-solid fa-chevron-left"></i>
                                                </button>
                                                <h3>Details</h3>
                                                <div style={{ width: 40 }}></div> {/* Spacer for center alignment */}
                                            </div>

                                            <div className="hd-content">
                                                <div className="hd-main-icon-circle">
                                                    <i className={`fas ${activeHistoryItem.type === 'prescription' ? 'fa-file-invoice' : 'fa-flask'}`}></i>
                                                </div>

                                                <h2 className="hd-title">Prescription</h2>
                                                <p className="hd-date">{activeHistoryItem.fullDate}</p>

                                                <div className="hd-facility-card">
                                                    <div className="hd-fc-icon">
                                                        <i className="fa-solid fa-asterisk"></i>
                                                    </div>
                                                    <div className="hd-fc-info">
                                                        <span className="hd-fc-label">FACILITY / CLINIC</span>
                                                        <h4 className="hd-fc-name">{activeHistoryItem.clinicName}</h4>
                                                    </div>
                                                </div>

                                                <h3 className="hd-section-title">Medications</h3>
                                                <div className="hd-medication-list">
                                                    {activeHistoryItem.medicines.map((med, idx) => (
                                                        <div key={idx} className="hd-med-card">
                                                            <div className="hd-med-top">
                                                                <h4>{med.name}</h4>
                                                                {med.dosage && <span className="hd-dosage-badge">{med.dosage}</span>}
                                                            </div>
                                                            {med.freq && (
                                                                <div className="hd-med-details">
                                                                    <div className="hd-md-item">
                                                                        <i className="fa-regular fa-clock"></i> {med.freq}
                                                                    </div>
                                                                    <div className="hd-md-item">
                                                                        <i className="fa-regular fa-calendar"></i> {med.duration}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>

                                            </div>
                                        </div>
                                    )}

                                    {/* ACCESS SCREEN */}
                                    {screen === 'access' && (
                                        <div className="screen-access animate-fade-in">
                                            <div className="home-header">
                                                <h1>Access</h1>
                                                <div className="profile-circle" onClick={() => setScreen('profile')} style={{ cursor: 'pointer' }}>JD</div>
                                            </div>

                                            <div className="med-id-card-gradient">
                                                <div className="mic-header">
                                                    <div className="mic-brand"><i className="fas fa-shield-alt"></i> Med-ID</div>
                                                    <i className="fas fa-share-alt"></i>
                                                </div>
                                                <div className="mic-number-box">
                                                    <span>2000 1548 23</span>
                                                </div>
                                                <p className="mic-footer">Share this ID with your doctor to grant access</p>
                                            </div>

                                            <div className="access-section-v2">
                                                <h3 className="as-title">Incoming Requests <span className="as-badge">1</span></h3>
                                                {accessRecords.filter(r => r.status === 'pending').map(r => (
                                                    <div key={r.id} className="access-card-real">
                                                        <div className="acr-header">
                                                            <div className="acr-icon req"><i className="fas fa-bell"></i></div>
                                                            <div className="acr-info"><h4>{r.clinicName}</h4><p>{r.doctorName}</p></div>
                                                        </div>
                                                        <div className="acr-actions">
                                                            <button className="btn-acr-1h" onClick={() => handleAccessAction(r.id, 'approve_1h')}>1 Hour</button>
                                                            <button className="btn-acr-full" onClick={() => handleAccessAction(r.id, 'approve_full')}>Full Access</button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="access-section-v2">
                                                <h3 className="as-title">Clinics with Access</h3>
                                                {accessRecords.filter(r => r.status === 'active').map(r => (
                                                    <div key={r.id} className="access-card-real active">
                                                        <div className="acr-header">
                                                            <div className="acr-icon active"><i className="fas fa-check-circle"></i></div>
                                                            <div className="acr-info"><h4>{r.clinicName}</h4><p>{r.doctorName}</p></div>
                                                        </div>
                                                        <button className="btn-acr-revoke" onClick={() => handleAccessAction(r.id, 'revoke')}>Revoke Access</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* PROFILE SCREEN */}
                                    {screen === 'profile' && (
                                        <div className="screen-profile animate-fade-in">
                                            {/* ... profile content ... */}
                                        </div>
                                    )}
                                </div>

                                {/* UPLOAD PROGRESS OVERLAY (MOVED OUT) */}
                                {uploadStatus !== 'idle' && (
                                    <div className="upload-progress-overlay animate-fade-in">
                                        {uploadPreview && (
                                            <div className="preview-container">
                                                <div className="preview-pill-wrapper">
                                                    <img src={uploadPreview} alt="Preview" className="upload-preview-img" />
                                                    <div className="scan-line"></div>
                                                </div>
                                            </div>
                                        )}
                                        <div className="upload-status-box">
                                            <div className="status-spinner"></div>
                                            <h3>{uploadStatus === 'uploading' ? 'Uploading...' : uploadType === 'lab' ? 'Analyzing Lab Report...' : 'Analyzing Prescription...'}</h3>
                                            <p>Extracting medical details from your image</p>
                                        </div>
                                    </div>
                                )}

                                {/* ALERT OVERLAY (MOVED OUT) */}
                                {activeAlert && (
                                    <div className="alert-overlay">
                                        <div className="alert-content">
                                            <h3>{activeAlert.title}</h3>
                                            <p>{activeAlert.message}</p>
                                            <div className="alert-actions">
                                                <button className="alert-btn-confirm" onClick={activeAlert.onConfirm}>{activeAlert.confirmText}</button>
                                                <button className="alert-btn-cancel" onClick={() => {
                                                    if (activeAlert.onCancel) activeAlert.onCancel();
                                                    setActiveAlert(null);
                                                }}>Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* BOTTOM NAV - HIDDEN ON LOGIN */}
                                {screen !== 'login' && screen !== 'forgot_password' && (
                                    <div className="floating-nav">
                                        <div className="nav-indicator" style={{
                                            left: screen === 'history' ? '10px' : (screen === 'upload' || screen === 'profile') ? 'calc(33.33% + 5px)' : 'calc(66.66% + 5px)',
                                            width: 'calc(33.33% - 15px)'
                                        }}></div>
                                        <div className={`nav-item ${screen === 'history' ? 'active' : ''}`} onClick={() => setScreen('history')}>
                                            <i className="fas fa-history"></i>
                                        </div>
                                        <div className={`nav-item ${(screen === 'upload' || screen === 'profile') ? 'active' : ''}`} onClick={() => setScreen('upload')}>
                                            <i className="fas fa-upload"></i>
                                        </div>
                                        <div className={`nav-item ${screen === 'access' ? 'active' : ''}`} onClick={() => setScreen('access')}>
                                            <i className="fas fa-key"></i>
                                        </div>
                                    </div>
                                )}

                                {/* PROFILE SCREEN (OVERLAY STYLE) */}
                                {screen === 'profile' && (
                                    <div className="screen-profile-overlay animate-slide-up">
                                        <div className="profile-header-done">
                                            <h3>Account</h3>
                                            <button className="btn-done" onClick={() => setScreen('upload')}>Close</button>
                                        </div>

                                        <div className="profile-scroll-content">
                                            <div className="profile-main-card">
                                                <div className="pmc-top">
                                                    <div className="pmc-avatar-wrapper">
                                                        <div className="pmc-avatar">JD</div>
                                                        <div className="pmc-camera-badge"><i className="fa-solid fa-camera"></i></div>
                                                    </div>
                                                    <div className="pmc-info">
                                                        <h2>John Doe</h2>
                                                        <p>john.doe@email.com</p>
                                                    </div>
                                                </div>
                                                <div className="pmc-divider"></div>
                                                <div className="pmc-med-id-row">
                                                    <div className="pmc-med-label">MED-ID</div>
                                                    <div className="pmc-med-value-group">
                                                        <span className="pmc-med-value">2000154823</span>
                                                        <i className="fa-regular fa-copy"></i>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="profile-section-title">Statistics</h3>
                                            <div className="profile-stats-card">
                                                <div className="stat-col"><strong>12</strong><span>Uploads</span></div>
                                                <div className="stat-col-divider"></div>
                                                <div className="stat-col"><strong>3</strong><span>Shared</span></div>
                                                <div className="stat-col-divider"></div>
                                                <div className="stat-col"><strong>8</strong><span>Months</span></div>
                                            </div>

                                            <h3 className="profile-section-title">Account</h3>
                                            <div className="profile-list-group">
                                                <div className="pl-item">
                                                    <div className="pl-left"><div className="pl-icon-bg"><i className="fa-regular fa-user"></i></div><span>Edit Profile</span></div>
                                                    <i className="fa-solid fa-chevron-right pl-arrow"></i>
                                                </div>
                                                <div className="pl-item">
                                                    <div className="pl-left"><div className="pl-icon-bg"><i className="fa-solid fa-shield-halved"></i></div><span>Privacy & Security</span></div>
                                                    <i className="fa-solid fa-chevron-right pl-arrow"></i>
                                                </div>
                                                <div className="pl-item">
                                                    <div className="pl-left">
                                                        <div className="pl-icon-bg"><i className="fa-regular fa-credit-card"></i></div>
                                                        <div className="pl-text-stack">
                                                            <span>Subscription</span>
                                                            <small>Free Plan</small>
                                                        </div>
                                                    </div>
                                                    <i className="fa-solid fa-chevron-right pl-arrow"></i>
                                                </div>
                                            </div>

                                            <div className="profile-section-header">
                                                <h3 className="profile-section-title">Preferences</h3>
                                                <span className="psh-link">Close</span>
                                            </div>
                                            <div className="profile-list-group">
                                                <div className="pl-item">
                                                    <div className="pl-left"><div className="pl-icon-bg"><i className="fa-regular fa-bell"></i></div><span>Notifications</span></div>
                                                    <div className="pl-toggle active"></div>
                                                </div>
                                                <div className="pl-item">
                                                    <div className="pl-left"><div className="pl-icon-bg"><i className="fa-solid fa-fingerprint"></i></div><span>Face ID / Touch ID</span></div>
                                                    <div className="pl-toggle"></div>
                                                </div>
                                                <div className="pl-item">
                                                    <div className="pl-left">
                                                        <div className="pl-icon-bg"><i className="fa-solid fa-language"></i></div>
                                                        <div className="pl-text-stack">
                                                            <span>Language</span>
                                                            <small>English</small>
                                                        </div>
                                                    </div>
                                                    <i className="fa-solid fa-chevron-right pl-arrow"></i>
                                                </div>
                                            </div>

                                            <h3 className="profile-section-title">Support</h3>
                                            <div className="profile-list-group">
                                                <div className="pl-item">
                                                    <div className="pl-left"><div className="pl-icon-bg"><i className="fa-regular fa-circle-question"></i></div><span>Help Center</span></div>
                                                    <i className="fa-solid fa-chevron-right pl-arrow"></i>
                                                </div>
                                                <div className="pl-item">
                                                    <div className="pl-left"><div className="pl-icon-bg"><i className="fa-regular fa-comment-dots"></i></div><span>Contact Us</span></div>
                                                    <i className="fa-solid fa-chevron-right pl-arrow"></i>
                                                </div>
                                                <div className="pl-item">
                                                    <div className="pl-left"><div className="pl-icon-bg"><i className="fa-regular fa-star"></i></div><span>Rate App</span></div>
                                                    <i className="fa-solid fa-chevron-right pl-arrow"></i>
                                                </div>
                                            </div>

                                            <div className="logout-btn-mockup" onClick={() => setScreen('login')}>
                                                <div className="pl-icon-bg logout-icon"><i className="fa-solid fa-arrow-right-from-bracket"></i></div>
                                                <span>Log Out</span>
                                            </div>

                                            <div className="profile-version">MedHive v1.0.0</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
};

export default Hero;
