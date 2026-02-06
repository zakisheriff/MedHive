import React, { useEffect } from 'react';
import '../../styles/global.css';

const PrivacyPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="legal-page">
            <div className="legal-header">
                <div className="container">
                    <h1>Privacy Policy</h1>
                    <p>Last updated: January 25, 2026</p>
                </div>
            </div>

            <div className="container legal-content">
                <section>
                    <h2>1. Introduction</h2>
                    <p>Welcome to MedHive. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
                </section>

                <section>
                    <h2>2. Data We Collect</h2>
                    <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
                    <ul>
                        <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier, marital status, title, date of birth and gender.</li>
                        <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                        <li><strong>Health Data:</strong> includes medical records, prescriptions, and lab reports explicitly uploaded by you or your healthcare provider with your consent.</li>
                    </ul>
                </section>

                <section>
                    <h2>3. How We Use Your Data</h2>
                    <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                    <ul>
                        <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                        <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                        <li>Where we need to comply with a legal or regulatory obligation.</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Data Security</h2>
                    <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.</p>
                </section>

                <section>
                    <h2>5. Your Legal Rights</h2>
                    <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.</p>
                </section>

                <section>
                    <h2>6. Contact Us</h2>
                    <p>If you have any questions about this privacy policy or our privacy practices, please contact us at: <a href="mailto:privacy@medhive.lk" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>privacy@medhive.lk</a></p>
                </section>
            </div>

            <style jsx>{`
                .legal-page {
                    padding-top: 60px; /* Reduced from 100px */
                    background: #fff;
                    min-height: 100vh;
                }
                .legal-header {
                    background: #fff;
                    padding: 60px 0 40px; /* Reduced padding */
                    text-align: center;
                    border-bottom: 1px solid rgba(220, 163, 73, 0.1);
                    margin-bottom: 40px; /* Reduced margin */
                }
                .legal-header h1 {
                    font-size: 48px;
                    font-weight: 900;
                    color: #111;
                    margin-bottom: 10px;
                    letter-spacing: -1px;
                }
                .legal-header p {
                    color: #666;
                    font-size: 16px;
                }
                .legal-content {
                    max-width: 800px;
                    padding-bottom: 100px;
                }
                .legal-content section {
                    margin-bottom: 40px;
                }
                .legal-content h2 {
                    font-size: 24px;
                    color: #111;
                    margin-bottom: 20px;
                    font-weight: 800;
                }
                .legal-content p {
                    color: #444;
                    line-height: 1.8;
                    margin-bottom: 15px;
                    font-size: 16px;
                }
                .legal-content ul {
                    list-style-type: none;
                    padding-left: 20px;
                    border-left: 3px solid var(--color-primary);
                }
                .legal-content li {
                    margin-bottom: 15px;
                    color: #444;
                    line-height: 1.6;
                }
                .legal-content li strong {
                    color: #111;
                }
                @media (max-width: 768px) {
                    .legal-header h1 {
                        font-size: 36px;
                    }
                    .legal-content {
                        padding: 0 20px 80px;
                    }
                }
            `}</style>
        </div>
    );
};

export default PrivacyPolicy;
