import React, { useState } from 'react';
import './Hero.css';

const Hero = () => {
    // iPhone State: 'upload', 'history', 'details', 'profile', 'access'
    const [screen, setScreen] = useState('upload');
    const [selectedItem, setSelectedItem] = useState(null);

    const historyItems = [
        {
            id: 1,
            type: 'hospital',
            icon: '🏥',
            title: 'General Checkup',
            subtitle: 'City Hospital • May 12, 2025',
            status: 'Passed',
            statusClass: 'check',
            details: 'Routine annual physical examination. Vitals stable. Blood pressure 120/80. No significant findings.'
        },
        {
            id: 2,
            type: 'lab',
            icon: '🧪',
            title: 'Blood Test Results',
            subtitle: 'Metro Labs • Apr 28, 2025',
            status: 'Review',
            statusClass: 'alert',
            details: 'Complete Blood Count (CBC). Hemoglobin slightly low. Vitamin D deficiency detected. Supplement recommended.'
        },
        {
            id: 3,
            type: 'pharmacy',
            icon: '💊',
            title: 'Prescription Filled',
            subtitle: 'MediCare Pharmacy • Apr 15, 2025',
            status: 'Active',
            statusClass: 'success',
            details: 'Amoxicillin 500mg. Take 3 times daily for 7 days. Finished course on Apr 22, 2025.'
        },
        {
            id: 4,
            type: 'vaccine',
            icon: '💉',
            title: 'Annual Vaccination',
            subtitle: 'Community Clinic • Jan 10, 2025',
            status: 'Done',
            statusClass: 'check',
            details: 'Influenza Vaccine (Flu Shot). Batch #4492-B. Next due: Jan 2026.'
        }
    ];

    const handleItemClick = (item) => {
        setSelectedItem(item);
        setScreen('details');
    };

    const handleBackClick = () => {
        if (screen === 'details') {
            setScreen('history');
            setSelectedItem(null);
        } else if (screen === 'history') {
            setScreen('home');
        }
    };

    const handleHomeClick = () => {
        setScreen('history');
    };

    return (
        <section className="hero">
            <div className="hero-gradient" />

            <div className="container hero-container">
                <div className="hero-left animate-fade-in">
                    <h1 className="hero-title">MedHive</h1>
                    <h2 className="hero-moto">Your Health,<br />Unified.</h2>
                    <p className="hero-subtitle">
                        MedHive is Sri Lanka's AI-Powered Healthcare Platform. Unify Medical Records, Digitize Prescriptions, and Access Intelligent Health Insights with Your Med ID.
                    </p>
                    <div className="hero-buttons">
                        <a href="#pharma">
                            <button className="btn-primary glass-btn">Get Started</button>
                        </a>
                        <a href="#clinics">
                            <button className="btn-secondary glass-btn">How It Works</button>
                        </a>
                    </div>
                </div>

                <div className="hero-right animate-slide-in-right">
                    {/* Interactive iPhone Mockup */}
                    <div className="iphone-mockup">
                        <div className="iphone-bezel">
                            <div className="iphone-screen">
                                <div className="dynamic-island"></div>
                                <div className="status-bar">
                                    <span>9:41</span>
                                </div>



                                <div className="app-content-container">
                                    {/* UPLOAD SCREEN (HOME) - Prescription Reader */}
                                    {screen === 'upload' && (
                                        <div className="screen-home animate-scale-in">
                                            <div className="main-honey-card">
                                                <div className="honey-card-pattern"></div>
                                                <div className="honey-card-content">
                                                    <h2 className="honey-card-title">Prescription<br />Reader</h2>
                                                    <p className="honey-card-subtitle">
                                                        Upload an image to extract Medicine Name, Dosage, and Duration automatically.
                                                    </p>
                                                    <div className="honey-card-actions">
                                                        <button className="action-btn" onClick={() => setScreen('history')}>Upload Prescription</button>
                                                        <button className="action-btn" onClick={() => setScreen('history')}>Upload Lab</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* HISTORY SCREEN */}
                                    {screen === 'history' && (
                                        <div className="screen-history animate-slide-in-right">
                                            {historyItems.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="history-item-card"
                                                    onClick={() => handleItemClick(item)}
                                                >
                                                    <div className="h-item-left">
                                                        <div className="h-icon-box">{item.icon}</div>
                                                        <div className="h-info">
                                                            <h4>{item.title}</h4>
                                                            <p>{item.subtitle.split('•')[0]}</p>
                                                        </div>
                                                    </div>
                                                    <div className="h-date">
                                                        {item.subtitle.split('•')[1].trim().split(',')[0]}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* DETAILS SCREEN */}
                                    {screen === 'details' && selectedItem && (
                                        <div className="screen-details animate-slide-in-right">
                                            <div className="detail-view-card">
                                                <div className="dv-header">
                                                    <div className="dv-icon">{selectedItem.icon}</div>
                                                    <h2>{selectedItem.title}</h2>
                                                </div>
                                                <div className="dv-row">
                                                    <span className="dv-label">Status</span>
                                                    <span className="dv-value" style={{ color: 'var(--color-primary)' }}>{selectedItem.status}</span>
                                                </div>
                                                <div className="dv-row">
                                                    <span className="dv-label">Location</span>
                                                    <span className="dv-value">{selectedItem.subtitle.split('•')[0]}</span>
                                                </div>
                                                <div className="dv-row">
                                                    <span className="dv-label">Date</span>
                                                    <span className="dv-value">{selectedItem.subtitle.split('•')[1]}</span>
                                                </div>
                                            </div>
                                            <button className="section-btn-primary" style={{ width: '100%', marginTop: '20px', padding: '15px', borderRadius: '15px' }} onClick={() => setScreen('history')}>
                                                Back
                                            </button>
                                        </div>
                                    )}

                                    {/* PROFILE SCREEN */}
                                    {screen === 'profile' && (
                                        <div className="screen-profile animate-fade-in">
                                            <div className="profile-header-bg">
                                                <div className="profile-avatar-wrapper">
                                                    <div className="profile-avatar-large">JD</div>
                                                    <div className="online-indicator"></div>
                                                </div>
                                            </div>

                                            <div className="profile-content-scroll">
                                                <div className="profile-info-card">
                                                    <h2>Johnathan E. Doe</h2>
                                                    <span className="profile-handle">@JohnDoe23</span>
                                                    <div className="profile-id-badge">ID: PNT-892345</div>

                                                    <div className="profile-action-row">
                                                        <button className="btn-profile-action primary">
                                                            Edit Profile
                                                        </button>
                                                        <button className="btn-profile-action secondary">
                                                            Sign Out
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="profile-section-title">Personal Details</div>
                                                <div className="profile-details-group">
                                                    <div className="profile-row-item">
                                                        <div className="p-icon-box">👤</div>
                                                        <div className="p-row-content">
                                                            <span className="p-label">Full Name</span>
                                                            <span className="p-value">Johnathan Elias Doe</span>
                                                        </div>
                                                    </div>
                                                    <div className="profile-row-separator"></div>
                                                    <div className="profile-row-item">
                                                        <div className="p-icon-box">🎂</div>
                                                        <div className="p-row-content">
                                                            <span className="p-label">Date of Birth</span>
                                                            <span className="p-value">Sept 14, 1985</span>
                                                        </div>
                                                    </div>
                                                    <div className="profile-row-separator"></div>
                                                    <div className="profile-row-item">
                                                        <div className="p-icon-box">🩸</div>
                                                        <div className="p-row-content">
                                                            <span className="p-label">Blood Type</span>
                                                            <span className="p-value">O+ (Positive)</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="profile-section-title">Settings</div>
                                                <div className="profile-details-group">
                                                    <div className="profile-row-item">
                                                        <div className="p-icon-box">🔔</div>
                                                        <div className="p-row-content">
                                                            <span className="p-label">Notifications</span>
                                                            <span className="p-value">On</span>
                                                        </div>
                                                        <i className="fas fa-chevron-right arrow-icon"></i>
                                                    </div>
                                                    <div className="profile-row-separator"></div>
                                                    <div className="profile-row-item">
                                                        <div className="p-icon-box">🛡️</div>
                                                        <div className="p-row-content">
                                                            <span className="p-label">Privacy & Security</span>
                                                        </div>
                                                        <i className="fas fa-chevron-right arrow-icon"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* ACCESS SCREEN */}
                                    {screen === 'access' && (
                                        <div className="screen-access animate-fade-in">
                                            <div className="access-header">
                                                <h2>Access</h2>
                                                <p>Manage who can see your data.</p>
                                            </div>

                                            <div className="access-search-container">
                                                <div className="search-bar">
                                                    <i className="fas fa-search search-icon"></i>
                                                    <input type="text" placeholder="Search clinics..." />
                                                </div>
                                            </div>

                                            <div className="access-list-scroll">
                                                <div className="access-card dark-card">
                                                    <div className="ac-content">
                                                        <h4>Maaran Clinic</h4>
                                                        <p>Last access: 2d ago</p>
                                                    </div>
                                                    <div className="ac-status alert">
                                                        <i className="fas fa-exclamation"></i>
                                                    </div>
                                                </div>

                                                <div className="access-card dark-card">
                                                    <div className="ac-content">
                                                        <h4>Vetri Clinic</h4>
                                                        <p>Active Access</p>
                                                    </div>
                                                    <div className="ac-status success">
                                                        <i className="fas fa-check"></i>
                                                    </div>
                                                </div>

                                                <div className="access-card dark-card">
                                                    <div className="ac-content">
                                                        <h4>Vetrimaaran Clinic</h4>
                                                        <p>Request Pending</p>
                                                    </div>
                                                    <div className="ac-status notification">1</div>
                                                </div>

                                                <div className="access-card dark-card">
                                                    <div className="ac-content">
                                                        <h4>Apollo Hospital</h4>
                                                        <p>Access Revoked</p>
                                                    </div>
                                                    <div className="ac-status alert">
                                                        <i className="fas fa-exclamation"></i>
                                                    </div>
                                                </div>

                                                <div className="access-card dark-card">
                                                    <div className="ac-content">
                                                        <h4>City Health Center</h4>
                                                        <p>Action Required</p>
                                                    </div>
                                                    <div className="ac-status alert">
                                                        <i className="fas fa-exclamation"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* FLOATING BOTTOM NAV */}
                                <div className="floating-nav">
                                    <div className={`nav-item ${screen === 'profile' ? 'active' : ''}`} onClick={() => setScreen('profile')}>
                                        <i className="far fa-user"></i>
                                        <span>Profile</span>
                                    </div>
                                    <div className={`nav-item ${screen === 'upload' ? 'active' : ''}`} onClick={() => setScreen('upload')}>
                                        <i className="fas fa-upload"></i>
                                        <span>Upload</span>
                                    </div>
                                    <div className={`nav-item ${screen === 'history' || screen === 'details' ? 'active' : ''}`} onClick={() => setScreen('history')}>
                                        <i className="fas fa-history"></i>
                                        <span>History</span>
                                    </div>
                                    <div className={`nav-item ${screen === 'access' ? 'active' : ''}`} onClick={() => setScreen('access')}>
                                        <i className="fas fa-lock"></i>
                                        <span>Access</span>
                                    </div>
                                </div>
                            </div>

                            <div className="iphone-buttons left-side-buttons"></div>
                            <div className="iphone-buttons right-side-button"></div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Hero;
