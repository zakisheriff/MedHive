import React, { useEffect, useRef, useState } from 'react';
import './CTASection.css';

const CTASection = ({ onCTAClick }) => {
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section className="cta-section" id="join" ref={sectionRef}>
            <div className={`cta-card glass-card scroll-scale-in ${isVisible ? 'visible' : ''}`}>
                <h2>Join the future of connected healthcare.</h2>
                <p>Be among the first to experience the power of AI-driven health management</p>
                <button className="btn-cta glass-btn" onClick={onCTAClick}>Get Early Access</button>
            </div>
        </section>
    );
};

export default CTASection;
