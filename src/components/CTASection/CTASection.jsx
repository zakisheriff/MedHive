import React from 'react';
import './CTASection.css';

const CTASection = () => {
    return (
        <section className="cta-section" id="pharma">
            <div className="cta-card glass-card">
                <h2>Join the future of connected healthcare.</h2>
                <p>Be among the first to experience the power of AI-driven health management</p>
                <button className="btn-cta glass-btn">Get Early Access</button>
            </div>
        </section>
    );
};

export default CTASection;
