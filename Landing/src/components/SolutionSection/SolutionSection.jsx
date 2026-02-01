import React, { useEffect, useRef, useState } from 'react';
import './SolutionSection.css';

const solutions = [
    {
        title: 'Prescription Reader',
        description: 'Instantly digitize handwritten prescriptions with advanced OCR',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" strokeWidth="2" />
            </svg>
        )
    },
    {
        title: 'Lab Report Analyzer',
        description: 'Extract and track lab values automatically over time',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2" />
            </svg>
        )
    },
    {
        title: 'Pharmacy Integration',
        description: 'Send prescriptions directly to your preferred pharmacy',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeWidth="2" />
            </svg>
        )
    },
    {
        title: 'Patient Health History',
        description: 'Complete medical timeline accessible with MedHive ID',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" />
            </svg>
        )
    },
    {
        title: 'Medicine Reminders',
        description: 'Never miss a dose with smart scheduling and alerts',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeWidth="2" />
            </svg>
        )
    },
    {
        title: 'Clinic Analytics',
        description: 'Real-time insights on patient trends and prescribing patterns',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeWidth="2" />
            </svg>
        )
    },
    {
        title: 'Pharma Insights',
        description: 'Data-driven medicine demand forecasting and market analysis',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    },
    {
        title: 'Hospital Access',
        description: 'Seamless patient data sharing across healthcare facilities',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" strokeWidth="2" />
            </svg>
        )
    }
];

const SolutionSection = () => {
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
        <section className="solution-section" id="ai" ref={sectionRef}>
            <div className="container">
                <h2 className={`section-title scroll-fade-in ${isVisible ? 'visible' : ''}`}>
                    The MedHive Ecosystem
                </h2>

                <div className="ecosystem-stack-container">
                    <div className="stack-thread-line"></div>

                    <div className="ecosystem-stack-flow">
                        {solutions.map((solution, index) => (
                            <div
                                key={index}
                                className={`stack-item ${index % 2 === 0 ? 'left' : 'right'} scroll-slide-up stagger-${index + 1} ${isVisible ? 'visible' : ''}`}
                            >
                                <div className="stack-connector">
                                    <div className="connector-dot"></div>
                                </div>
                                <div className="stack-card glass-card">
                                    <div className="stack-icon-box">
                                        {solution.icon}
                                    </div>
                                    <div className="stack-text">
                                        <h3>{solution.title}</h3>
                                        <p>{solution.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SolutionSection;
