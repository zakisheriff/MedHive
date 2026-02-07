import React, { useEffect, useRef, useState } from 'react';
import './CTASection.css';
import ContactForm from '../ContactForm/ContactForm';

const CTASection = () => {
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
            <div className={`cta-card glass-card scroll-fade-in ${isVisible ? 'visible' : ''}`}>
                <div className="cta-content">
                    <h2>Partner with MedHive</h2>
                    <p>Empowering clinics, pharmacies, and healthcare providers with AI-driven solutions.<br />Transform your patient care today.</p>
                </div>
                <div className="cta-form-wrapper">
                    <ContactForm />
                </div>
            </div>
        </section>
    );
};

export default CTASection;
