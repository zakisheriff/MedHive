import React from 'react';
import './SplashScreen.css';

const SplashScreen = ({ isExiting }) => {
    return (
        <div className={`splash-screen ${isExiting ? 'fade-out' : ''}`}>
            <div className="splash-logo-container">
                <img src="logode.png" alt="MedHive Logo" className="splash-logo" />
            </div>
        </div>
    );
};

export default SplashScreen;
