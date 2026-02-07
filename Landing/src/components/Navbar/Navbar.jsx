import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ scrolled, onLogoClick }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navContentRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Close menu when clicking outside the nav-content specifically
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileMenuOpen && navContentRef.current && !navContentRef.current.contains(event.target)) {
                setMobileMenuOpen(false);
            }
        };

        document.addEventListener('touchstart', handleClickOutside);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('touchstart', handleClickOutside);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [mobileMenuOpen]);

    const handleNavClick = (e, sectionId) => {
        e.preventDefault();
        setMobileMenuOpen(false);

        if (sectionId === 'home') {
            if (location.pathname !== '/') {
                navigate('/');
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            return;
        }

        // If not on home page, navigate to home with hash
        if (location.pathname !== '/') {
            window.location.href = `/#${sectionId}`;
            return;
        }

        // On home page, smooth scroll
        const element = document.getElementById(sectionId);
        if (element) {
            const navbarHeight = 30;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: elementPosition - navbarHeight,
                behavior: 'smooth'
            });
        }
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <>
            {/* Overlay to catch taps outside menu */}
            {mobileMenuOpen && (
                <div
                    className="nav-overlay"
                    onClick={closeMobileMenu}
                    onTouchStart={closeMobileMenu}
                />
            )}
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div
                    className={`nav-content ${mobileMenuOpen ? 'expanded' : ''}`}
                    ref={navContentRef}
                >
                    <img
                        src="logode.png"
                        alt="MedHive Logo"
                        className="nav-logo-image"
                        onClick={(e) => {
                            if (window.innerWidth <= 900) {
                                toggleMobileMenu();
                            } else {
                                onLogoClick();
                            }
                        }}
                    />
                    <div className={`nav-links ${mobileMenuOpen ? 'show' : ''}`}>
                        <a onClick={(e) => handleNavClick(e, 'home')} style={{ cursor: 'pointer' }}>Home</a>
                        <a onClick={(e) => handleNavClick(e, 'problems')} style={{ cursor: 'pointer' }}>Problems</a>
                        <a onClick={(e) => handleNavClick(e, 'ai')} style={{ cursor: 'pointer' }}>Solutions</a>
                        <a onClick={(e) => handleNavClick(e, 'features')} style={{ cursor: 'pointer' }}>Features</a>
                        <button className="nav-btn mobile-only" onClick={(e) => handleNavClick(e, 'join')} style={{ marginTop: '10px' }}>
                            Partner with Us
                        </button>
                    </div>
                    <div className="nav-actions mobile-hidden">
                        <button className="nav-btn" onClick={(e) => handleNavClick(e, 'join')}>
                            Partner with Us
                        </button>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
