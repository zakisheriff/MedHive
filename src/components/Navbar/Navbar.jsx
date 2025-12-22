import React, { useState } from 'react';
import './Navbar.css';

const Navbar = ({ scrolled, onLogoClick }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleNavClick = (e, sectionId) => {
        e.preventDefault();
        setMobileMenuOpen(false);

        if (sectionId === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const element = document.getElementById(sectionId);
        if (element) {
            // Smaller offset for navbar height
            const navbarHeight = 20;
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

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className={`nav-content ${mobileMenuOpen ? 'expanded' : ''}`}>
                <img
                    src="logode.png"
                    alt="MedHive Logo"
                    className="nav-logo-image"
                    onClick={(e) => {
                        // On mobile, toggle menu. On desktop, scroll to top
                        if (window.innerWidth <= 900) {
                            toggleMobileMenu();
                        } else {
                            onLogoClick();
                        }
                    }}
                />
                <div className={`nav-links ${mobileMenuOpen ? 'show' : ''}`}>
                    <a href="#" className="mobile-only" onClick={(e) => handleNavClick(e, 'home')}>Home</a>
                    <a href="#problems" onClick={(e) => handleNavClick(e, 'problems')}>Problems</a>
                    <a href="#ai" onClick={(e) => handleNavClick(e, 'ai')}>Solutions</a>
                    <a href="#features" onClick={(e) => handleNavClick(e, 'features')}>Features</a>
                    <a href="#clinics" onClick={(e) => handleNavClick(e, 'clinics')}>Patient Journey</a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
