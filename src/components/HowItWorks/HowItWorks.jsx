import React from 'react';
import './HowItWorks.css';

const steps = [
    {
        number: 1,
        title: 'First Visit: Scan & Sync',
        description: 'Patient scans the QR code at the doctor\'s table to access/login to the MedHive web app. They grant access to their record and upload any existing allergies/history.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 12l2.239-2.239a2.037 2.037 0 012.871 0L12 14.004l3.89-3.89a2.037 2.037 0 012.872 0L21 12m-9 9V3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    },
    {
        number: 2,
        title: 'Prescription Digitization',
        description: 'After consultation, the handwritten prescription is scanned using the app. AI extracts the details, and the digital order is immediately sent to the in-house Clinic Pharmacy.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2" strokeLinecap="round" />
            </svg>
        )
    },
    {
        number: 3,
        title: 'Next Visit: Med ID Lookup',
        description: 'For future visits, the patient provides their Med ID. The doctor instantly accesses the patient\'s complete clinical history, allergies, and past medication intake for better diagnosis.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 11.5a8.38 8.38 0 01-.25 2.25 8.1 8.1 0 01-1.35 1.76 7.8 7.8 0 01-1.97 1.25l-1.39.63M12 21a9 9 0 01-8.5-4.5M3 11.5A8.5 8.5 0 0111.5 3M12 12a3 3 0 100-6 3 3 0 000 6z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    },
    {
        number: 4,
        title: 'Seamless Pharmacy & Record Update',
        description: 'The clinic pharmacy prepares the order, and once dispensed, the new prescription details and any doctor\'s clinical notes are automatically saved to the patient\'s MedHive account.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M8 12h8m-8 4h8m-8-8h.01M3 21a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4zM12 7V3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    }
];

const HowItWorks = () => {
    return (
        <section className="how-it-works" id="clinics">
            <div className="container">
                <h2 className="section-title">MedHive Patient Journey</h2>
                <div className="steps-grid">
                    {steps.map((step) => (
                        <div key={step.number} className="step-card glass-card">
                            <div className="step-number">{step.number}</div>
                            <div className="step-icon">
                                {step.icon}
                            </div>
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
