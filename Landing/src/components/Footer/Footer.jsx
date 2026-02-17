import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Footer.css';

const Footer = ({ onScrollToTop }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleScrollTo = (e, sectionId) => {
        e.preventDefault();

        // If not on home page, navigate to home with hash
        if (location.pathname !== '/') {
            if (sectionId === 'top') {
                navigate('/');
            } else {
                navigate('/', { state: { scrollTo: sectionId } });
                // Fallback for simple hash navigation
                setTimeout(() => {
                    window.location.hash = sectionId;
                }, 100);
            }
            return;
        }

        if (sectionId === 'top') {
            onScrollToTop();
        } else {
            const element = document.getElementById(sectionId);
            if (element) {
                const navbarHeight = 20;
                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: elementPosition - navbarHeight,
                    behavior: 'smooth'
                });
            }
        }
    };

    return (
        <footer className="footer" id="contact">
            <div className="footer-content">
                {/* Top Section - Logo and Tagline */}
                <div className="footer-brand">
                    <div className="footer-logo">MedHive</div>
                    <p className="footer-tagline">Your Health, Unified.</p>
                </div>

                {/* Middle Section - Links Grid */}
                <div className="footer-grid">
                    {/* Quick Links */}
                    <div className="footer-column">
                        <h4>Quick Links</h4>
                        <nav className="footer-nav">
                            <a href="/" onClick={(e) => handleScrollTo(e, 'top')}>Home</a>
                            <a href="/#problems" onClick={(e) => handleScrollTo(e, 'problems')}>Problems</a>
                            <a href="/#ai" onClick={(e) => handleScrollTo(e, 'ai')}>Solutions</a>
                            <a href="/#features" onClick={(e) => handleScrollTo(e, 'features')}>Features</a>
                            <a href="https://patient.medhive.lk" target="_blank" rel="noopener noreferrer">Patient App</a>
                        </nav>
                    </div>

                    {/* Legal */}
                    <div className="footer-column">
                        <h4>Legal</h4>
                        <nav className="footer-nav">
                            <Link to="/privacy-policy">Privacy Policy</Link>
                            <Link to="/terms-of-service">Terms of Service</Link>
                            <Link to="/about-us">About Us</Link>
                        </nav>
                    </div>

                    {/* Connect */}
                    <div className="footer-column">
                        <h4>Connect</h4>
                        <nav className="footer-nav">
                            <a href="mailto:reachmedhive@gmail.com" className="footer-email-link">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2" />
                                </svg>
                                reachmedhive@gmail.com
                            </a>
                        </nav>
                        <div className="footer-social">
                            <a
                                href="https://www.linkedin.com/company/medhivelk"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-link"
                                aria-label="LinkedIn"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>
                            <a
                                href="https://www.instagram.com/medhive.lk"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-link"
                                aria-label="Instagram"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Section - Copyright */}
                <div className="footer-bottom">
                    <p className="footer-copy">© 2026 MedHive. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
