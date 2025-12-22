import React, { useEffect, useRef, useState } from 'react';
import './FeaturesSection.css';

const features = [
    {
        title: 'Scan Prescription',
        description: 'AI extracts medicine names, dosages, and schedules instantly from photos',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeWidth="2" />
                <path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2" />
            </svg>
        )
    },
    {
        title: 'Upload Lab Reports',
        description: 'Automatically extract and track blood work and diagnostic test results',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeWidth="2" strokeLinecap="round" />
            </svg>
        )
    },
    {
        title: 'Send to Clinic',
        description: 'Forward digital prescriptions directly to the pharmacy inside the clinic',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2" />
            </svg>
        )
    },
    {
        title: 'Complete Health History',
        description: 'Access your entire Medical Record and Prescription History instantly via your Med ID.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeWidth="2" />
            </svg>
        )
    },
    {
        title: 'Doctor Insights & Alerts',
        description: 'Doctors view Allergies, Past Intake, and Clinical Notes via Med ID for better checkups.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 2v6h6m-3-4v8m-3-1v3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    },
    {
        title: 'Real-Time Analytics',
        description: 'Clinics and pharma companies gain actionable insights from aggregated data',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2" />
            </svg>
        )
    }
];

const FeaturesSection = () => {
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section className="features-section" id="features" ref={sectionRef}>
            <div className="container">
                <h2 className={`section-title scroll-fade-in ${isVisible ? 'visible' : ''}`}>
                    Key Features
                </h2>
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`feature-card glass-card scroll-slide-up stagger-${index + 1} ${isVisible ? 'visible' : ''}`}
                        >
                            <div className="feature-icon">
                                {feature.icon}
                            </div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
