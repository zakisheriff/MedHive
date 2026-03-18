import React from 'react';
import './SplashScreen.css';

const SplashScreen = ({ isExiting }) => {
    return (
        <div className={`splash-screen ${isExiting ? 'fade-out' : ''}`}>
            <div className="splash-logo-container">
                <img
                    src="/logode.png"
                    alt="MedHive Logo"
                    className="splash-logo"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/logo.jpeg';
                    }}
                />
            </div>
        </div>
    );
};

export default SplashScreen;
