import React, { useState } from 'react';
import { Bell, ChevronDown, Search, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className={styles.navbar}>
            <div className={styles.leftSection}>
                <div className={styles.logo}>
                    <img src="/Images/MedHive.png" alt="MedHive Logo" style={{ height: '48px', width: 'auto' }} />
                    MedHive <span>Pharma</span>
                </div>
            </div>

            <div className={styles.centerSection}>
                {/* Company Selector */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="text-muted text-sm">Company:</span>
                    <select className={styles.companySelector}>
                        <option>{user?.companyName || 'Apex Pharmaceuticals Ltd'}</option>
                        <option>MediCare Global</option>
                        <option>BioGen Corp</option>
                    </select>
                </div>
            </div>

            <div className={styles.rightSection}>
                <button className={styles.iconButton}>
                    <Search size={20} />
                </button>
                <button className={styles.iconButton}>
                    <Bell size={20} />
                    <span className={styles.badge}>3</span>
                </button>

                <div 
                    className={styles.userProfile}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    style={{ cursor: 'pointer', position: 'relative' }}
                >
                    <div className={styles.avatar}>
                        {user?.fullName?.split(' ').map(n => n[0]).join('') || 'JD'}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">{user?.fullName || 'John Doe'}</span>
                        <span className="text-xs text-muted">Admin</span>
                    </div>
                    <ChevronDown size={16} className="text-muted" />

                    {showUserMenu && (
                        <div 
                            style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                marginTop: '0.5rem',
                                background: 'white',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                minWidth: '200px',
                                zIndex: 1000,
                                overflow: 'hidden'
                            }}
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowUserMenu(false);
                                }}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    border: 'none',
                                    background: 'white',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                            >
                                <User size={18} />
                                Profile
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleLogout();
                                }}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    border: 'none',
                                    background: 'white',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    color: '#ef4444',
                                    borderTop: '1px solid #e2e8f0',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                            >
                                <LogOut size={18} />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
