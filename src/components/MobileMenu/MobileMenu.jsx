import React from 'react';
import './MobileMenu.css';

const MobileMenu = ({ isOpen, onClose, onScrollToTop }) => {
    return (
        <>
            {/* Overlay */}
            <div
                className={`mobile-menu-overlay ${isOpen ? 'active' : ''}`}
                onClick={onClose}
            />

            {/* Menu */}
            <div className={`mobile-menu glass-card ${isOpen ? 'active' : ''}`}>
                <div className="mobile-menu-links">
                    <a onClick={onScrollToTop} style={{ cursor: 'pointer' }}>
                        Home
                    </a>
                    <a href="#problems" onClick={onClose}>
                        Problems
                    </a>
                    <a href="#ai" onClick={onClose}>
                        Solutions
                    </a>
                    <a href="#features" onClick={onClose}>
                        Features
                    </a>
                    <a href="#contact" onClick={onClose}>
                        Contact
                    </a>
                </div>
            </div>
        </>
    );
};

export default MobileMenu;
