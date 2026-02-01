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
                    <a
                        onClick={(e) => {
                            e.preventDefault();
                            const el = document.getElementById('problems');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                            onClose();
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        Problems
                    </a>
                    <a
                        onClick={(e) => {
                            e.preventDefault();
                            const el = document.getElementById('ai');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                            onClose();
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        Solutions
                    </a>
                    <a
                        onClick={(e) => {
                            e.preventDefault();
                            const el = document.getElementById('features');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                            onClose();
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        Features
                    </a>
                    <a
                        onClick={(e) => {
                            e.preventDefault();
                            const el = document.getElementById('contact');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                            onClose();
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        Contact
                    </a>
                </div>
            </div>
        </>
    );
};

export default MobileMenu;
