import React, { useEffect } from 'react';
import '../../styles/global.css';

const AboutUs = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="about-page">
            <div className="about-header">
                <div className="container">
                    <h1>About MedHive</h1>
                    <p className="subtitle">The Future of Personalized Healthcare in Sri Lanka</p>
                </div>
            </div>

            <div className="container about-content">
                <section className="mission-section">
                    <div className="content-grid two-columns">
                        <div className="text-block">
                            <h2>Our Mission</h2>
                            <p>MedHive is on a mission to unify Sri Lanka's fragmented healthcare ecosystem. We believe that your medical history belongs to you—not scattered across filing cabinets in different hospitals.</p>
                            <p>By connecting patients, doctors, and clinics through a secure, AI-powered platform, we're making healthcare more accessible, efficient, and intelligent for everyone.</p>
                        </div>
                        <div className="highlight-card glass-card">
                            <h3>Why We Exist</h3>
                            <p>To eliminate the question "Do you have your past reports?" and replace it with "I see everything right here."</p>
                        </div>
                    </div>
                </section>

                <section className="values-section">
                    <h2>Our Core Values</h2>
                    <div className="values-grid">
                        <div className="value-card">
                            <div className="icon-box">
                                <i className="fas fa-user-shield"></i>
                            </div>
                            <h3>Privacy First</h3>
                            <p>Your health data is sensitive. We treat it with the highest level of security and encryption.</p>
                        </div>
                        <div className="value-card">
                            <div className="icon-box">
                                <i className="fas fa-heartbeat"></i>
                            </div>
                            <h3>Patient Centric</h3>
                            <p>Every feature we build starts with one question: "Does this improve the patient's life?"</p>
                        </div>
                        <div className="value-card">
                            <div className="icon-box">
                                <i className="fas fa-brain"></i>
                            </div>
                            <h3>AI for Good</h3>
                            <p>We use Artificial Intelligence to assist doctors, not replace them, enhancing care with data-driven insights.</p>
                        </div>
                    </div>
                </section>

                <section className="story-section">
                    <h2>Our Story</h2>
                    <p>Founded with a vision to digitize Sri Lanka's healthcare, MedHive started as a simple idea: what if you could carry your entire medical history in your pocket? Today, we are building the infrastructure that connects clinics, digitizes prescriptions via OCR, and provides actionable health insights.</p>
                </section>
            </div>

            <style jsx>{`
                .about-page {
                    padding-top: 60px; /* Reduced from 100px */
                    background: #fff;
                    min-height: 100vh;
                }
                .about-header {
                    background: linear-gradient(135deg, #fdfbf7 0%, #fff 100%);
                    padding: 60px 0 50px; /* Reduced from 100px 0 80px */
                    text-align: center;
                    margin-bottom: 50px; /* Reduced margin */
                }
                .about-header h1 {
                    font-size: 56px;
                    font-weight: 900;
                    color: #111;
                    margin-bottom: 20px;
                    letter-spacing: -2px;
                }
                .subtitle {
                    font-size: 20px;
                    color: #666;
                    max-width: 600px;
                    margin: 0 auto;
                }
                .about-content {
                    max-width: 1000px;
                    padding-bottom: 100px;
                }
                section {
                    margin-bottom: 100px;
                }
                h2 {
                    font-size: 32px;
                    font-weight: 800;
                    color: #111;
                    margin-bottom: 30px;
                }
                .content-grid {
                    display: grid;
                    gap: 60px;
                    align-items: center;
                }
                .two-columns {
                    grid-template-columns: 1.5fr 1fr;
                }
                .text-block p {
                    font-size: 18px;
                    line-height: 1.8;
                    color: #444;
                    margin-bottom: 20px;
                }
                .highlight-card {
                    padding: 40px;
                    background: linear-gradient(135deg, var(--color-primary) 0%, #e6b96e 100%);
                    border-radius: 30px;
                    color: #fff;
                    text-align: center;
                    box-shadow: 0 20px 40px rgba(220, 163, 73, 0.3);
                }
                .highlight-card h3 {
                    font-size: 24px;
                    font-weight: 800;
                    margin-bottom: 15px;
                    color: #fff;
                }
                .highlight-card p {
                    font-size: 18px;
                    font-weight: 500;
                    line-height: 1.6;
                    opacity: 0.9;
                }
                .values-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 30px;
                }
                .value-card {
                    background: #fdfbf7;
                    padding: 40px 30px;
                    border-radius: 24px;
                    text-align: center;
                    transition: transform 0.3s ease;
                    border: 1px solid rgba(220, 163, 73, 0.1);
                }
                .value-card:hover {
                    transform: translateY(-10px);
                    background: #fff;
                    box-shadow: 0 15px 30px rgba(0,0,0,0.05);
                }
                .icon-box {
                    width: 60px;
                    height: 60px;
                    background: rgba(220, 163, 73, 0.1);
                    color: var(--color-primary);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    margin: 0 auto 20px;
                }
                .value-card h3 {
                    font-size: 20px;
                    font-weight: 700;
                    margin-bottom: 10px;
                    color: #111;
                }
                .value-card p {
                    color: #666;
                    line-height: 1.6;
                }
                .story-section p {
                    font-size: 18px;
                    line-height: 1.8;
                    color: #444;
                    max-width: 800px;
                }

                @media (max-width: 900px) {
                    .about-header {
                        padding: 60px 0;
                    }
                    .about-header h1 {
                        font-size: 42px;
                    }
                    .two-columns {
                        grid-template-columns: 1fr;
                        gap: 40px;
                    }
                }
            `}</style>
        </div>
    );
};

export default AboutUs;
