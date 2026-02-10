import React, { useEffect, useRef, useState } from 'react';
import './ProblemSection.css';

const problems = [
    {
        title: 'Illegible Prescriptions',
        description: 'Handwritten Prescriptions cause Confusion and Medication Errors',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth="2" strokeLinecap="round" />
            </svg>
        )
    },
    {
        title: 'Lost Health Records',
        description: 'Patient History Scattered Across Multiple Providers with No Central System',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2" strokeLinecap="round" />
            </svg>
        )
    },
    {
        title: 'Pharmacy Errors',
        description: 'Manual Data Entry Leads to Dispensing Mistakes and Patient Harm',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeWidth="2" strokeLinecap="round" />
            </svg>
        )
    },
    {
        title: 'No Data Insights',
        description: 'Clinics and Pharmacies Lack Analytics for Better Decision-Making',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeWidth="2" />
            </svg>
        )
    },
    {
        title: 'Blind Medicine Imports',
        description: 'Pharma Companies Import Without Understanding Real Market Demand',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" />
            </svg>
        )
    },
    {
        title: 'Fragmented Care',
        description: 'Patients Struggle to Coordinate Care Across Multiple Healthcare Providers',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth="2" />
            </svg>
        )
    }
];

const ProblemSection = () => {
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
        <section className="problem-section" id="problems" ref={sectionRef}>
            <div className="container">
                <h2 className={`section-title scroll-fade-in ${isVisible ? 'visible' : ''}`}>
                    Healthcare Challenges in Sri Lanka
                </h2>
                <div className="problem-grid">
                    {problems.map((problem, index) => (
                        <div
                            key={index}
                            className={`problem-card glass-card scroll-slide-up stagger-${index + 1} ${isVisible ? 'visible' : ''}`}
                        >
                            <div className="icon-placeholder">
                                {problem.icon}
                            </div>
                            <h3>{problem.title}</h3>
                            <p>{problem.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProblemSection;
