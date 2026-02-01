import React, { useState, useRef } from 'react';
import './Hero.css';

const Hero = () => {
    // iPhone State: 'upload', 'history', 'access', 'profile'
    const [screen, setScreen] = useState('upload');
    const [uploadStatus, setUploadStatus] = useState('idle');
    const [activeAlert, setActiveAlert] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const fileInputRef = useRef(null);

    // History Detail State
    const [activeHistoryItem, setActiveHistoryItem] = useState(null);

    const handleHistoryClick = (item) => {
        setActiveHistoryItem(item);
    };

    const handleBackFromHistory = () => {
        setActiveHistoryItem(null);
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

    const handleUploadClick = () => { fileInputRef.current.click(); };
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setUploadStatus('uploading');
            setTimeout(() => { setUploadStatus('processing'); }, 2000);
            setTimeout(() => {
                setUploadStatus('completed');
                setTimeout(() => { setUploadStatus('idle'); }, 5000);
            }, 4500);
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

    return (
        <section className="hero">
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*,.pdf" onChange={handleFileChange} />
            <div className="hero-gradient" />

            <div className="container hero-container">
                <div className="hero-left animate-fade-in">
                    <h1 className="hero-title">MedHive</h1>
                    <h2 className="hero-moto">Your Health,<br />Unified.</h2>
                    <p className="hero-subtitle">
                        MedHive is Sri Lanka's AI-Powered Healthcare Platform. Unify Medical Records, Digitize Prescriptions, and Access Intelligent Health Insights with Your Med ID.
                    </p>
                    <div className="hero-buttons">
                        <a href="#join"><button className="btn-primary glass-btn">Get Started</button></a>
                        <a href="#ai"><button className="btn-secondary glass-btn">Learn More</button></a>
                    </div>
                </div>

                <div className="hero-right animate-slide-in-right">
                    <div className="iphone-mockup">
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
                                    {/* UPLOAD SCREEN */}
                                    {screen === 'upload' && (
                                        <div className="screen-home animate-fade-in">
                                            <div className="home-header">
                                                <h1>Upload</h1>
                                                <div className="profile-circle" onClick={() => setScreen('profile')} style={{ cursor: 'pointer' }}>JD</div>
                                            </div>

                                            <div className="upload-main-card">
                                                <div className="upload-icon-circle">
                                                    <i className="fa-regular fa-file-lines"></i>
                                                </div>
                                                <h2>Upload Your Health Record</h2>
                                                <p>Upload an Image to Extract Medicine Name, Dosage, and Duration</p>

                                                <div className="upload-actions-list">
                                                    <div className="upload-action-item" onClick={handleUploadClick}>
                                                        <div className="ua-content">
                                                            <h4>Prescription Reader</h4>
                                                            <span>Extract Medicine Details</span>
                                                        </div>
                                                        <i className="fa-solid fa-chevron-right ua-arrow"></i>
                                                    </div>
                                                    <div className="upload-action-item">
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
                                                <h1>History</h1>
                                                <div className="profile-circle" onClick={() => setScreen('profile')} style={{ cursor: 'pointer' }}>JD</div>
                                            </div>

                                            <div className="search-bar-pill">
                                                <i className="fas fa-search"></i>
                                                <input type="text" placeholder="Search by medicine, doctor, clinic..." disabled />
                                            </div>

                                            <div className="filter-chips-row">
                                                <div className="f-chip active"><i className="fa-solid fa-border-all"></i> All</div>
                                                <div className="f-chip"><i className="fa-regular fa-file-lines"></i> Prescriptions</div>
                                                <div className="f-chip"><i className="fa-solid fa-flask"></i> Lab Reports</div>
                                            </div>

                                            {historyGroups.map(yearGroup => (
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
                                            ))}
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

                                    {/* ALERT OVERLAY */}
                                    {activeAlert && (
                                        <div className="alert-overlay">
                                            <div className="alert-content">
                                                <h3>{activeAlert.title}</h3>
                                                <p>{activeAlert.message}</p>
                                                <div className="alert-actions">
                                                    <button className="alert-btn-confirm" onClick={activeAlert.onConfirm}>{activeAlert.confirmText}</button>
                                                    <button className="alert-btn-cancel" onClick={() => setActiveAlert(null)}>Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* BOTTOM NAV */}
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

                                {/* PROFILE SCREEN (OVERLAY STYLE) */}
                                {screen === 'profile' && (
                                    <div className="screen-profile-overlay animate-slide-up">
                                        <div className="profile-header-done">
                                            <h3>Account</h3>
                                            <button className="btn-done" onClick={() => setScreen('upload')}>Close</button>
                                        </div>

                                        <div className="id-card-apple">
                                            <div className="ica-top">
                                                <div className="ica-avatar">JD</div>
                                                <div className="ica-text">
                                                    <h2>Johnathan Doe</h2>
                                                    <p>john.doe@email.com</p>
                                                </div>
                                            </div>
                                            <div className="ica-divider"></div>
                                            <div className="ica-footer">
                                                <div className="ica-med-label">MED-ID</div>
                                                <div className="ica-med-value">2000154823</div>
                                            </div>
                                        </div>

                                        <div className="stats-card-apple">
                                            <div className="stat-unit"><strong>12</strong><span>Uploads</span></div>
                                            <div className="stat-v-divider"></div>
                                            <div className="stat-unit"><strong>3</strong><span>Shared</span></div>
                                            <div className="stat-v-divider"></div>
                                            <div className="stat-unit"><strong>8</strong><span>Months</span></div>
                                        </div>

                                        <h4 className="pref-section-title">Account</h4>
                                        <div className="menu-card-apple">
                                            <div className="mca-item">
                                                <div className="mca-icon"><i className="fas fa-user-circle"></i></div>
                                                <span>Edit Profile</span>
                                                <i className="fas fa-chevron-right mca-chevron"></i>
                                            </div>
                                            <div className="mca-item">
                                                <div className="mca-icon"><i className="fas fa-shield-alt"></i></div>
                                                <span>Privacy & Security</span>
                                                <i className="fas fa-chevron-right mca-chevron"></i>
                                            </div>
                                        </div>

                                        <h4 className="pref-section-title">Support</h4>
                                        <div className="menu-card-apple">
                                            <div className="mca-item">
                                                <div className="mca-icon"><i className="fas fa-question-circle"></i></div>
                                                <span>Help Center</span>
                                                <i className="fas fa-chevron-right mca-chevron"></i>
                                            </div>
                                            <div className="mca-item destructive">
                                                <div className="mca-icon"><i className="fas fa-sign-out-alt"></i></div>
                                                <span>Log Out</span>
                                            </div>
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
