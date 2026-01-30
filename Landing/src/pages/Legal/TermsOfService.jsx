import React, { useEffect } from 'react';
import '../../styles/global.css';

const TermsOfService = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="legal-page">
            <div className="legal-header">
                <div className="container">
                    <h1>Terms of Service</h1>
                    <p>Last updated: January 25, 2026</p>
                </div>
            </div>

            <div className="container legal-content">
                <section>
                    <h2>1. Agreement to Terms</h2>
                    <p>These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and MedHive ("we," "us" or "our"), concerning your access to and use of the MedHive website and application.</p>
                </section>

                <section>
                    <h2>2. Intellectual Property Rights</h2>
                    <p>Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.</p>
                </section>

                <section>
                    <h2>3. User Representations</h2>
                    <p>By using the Site, you represent and warrant that:</p>
                    <ul>
                        <li>All registration information you submit will be true, accurate, current, and complete.</li>
                        <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                        <li>You have the legal capacity and you agree to comply with these Terms of Use.</li>
                        <li>You are not a minor in the jurisdiction in which you reside.</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Medical Disclaimer</h2>
                    <p>The Site and its Content are for informational purposes only. The Content is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
                </section>

                <section>
                    <h2>5. Limitation of Liability</h2>
                    <p>In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the site, even if we have been advised of the possibility of such damages.</p>
                </section>

                <section>
                    <h2>6. Contact Us</h2>
                    <p>To resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at: <a href="mailto:support@medhive.lk" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>support@medhive.lk</a></p>
                </section>
            </div>

            <style jsx>{`
                .legal-page {
                    padding-top: 60px; /* Reduced from 100px */
                    background: #fff;
                    min-height: 100vh;
                }
                .legal-header {
                    background: linear-gradient(135deg, #fdfbf7 0%, #fff 100%);
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

export default TermsOfService;
