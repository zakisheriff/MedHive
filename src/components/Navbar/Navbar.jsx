import React from 'react';
import './Navbar.css';

const Navbar = ({ scrolled, onLogoClick }) => {
    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="nav-content">
                <img
                    src="logode.png"
                    alt="MedHive Logo"
                    className="nav-logo-image"
                    onClick={onLogoClick}
                />
                <div className="nav-links">
                    <a href="#problems">Problems</a>
                    <a href="#ai">Solutions</a>
                    <a href="#features">Features</a>
                    <a href="#contact">Contact</a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
