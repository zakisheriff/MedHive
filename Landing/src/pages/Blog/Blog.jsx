import React, { useEffect } from 'react';
import '../../styles/global.css';
import blogTitleImg from './images/blog-title.jpg';
import blogTitle2Img from './images/blog-title2.jpg';
import ContactForm from '../../components/ContactForm/ContactForm';

const Blog = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="blog-page">
            <div className="blog-header">
                <div className="container">
                    <p className="blog-date">March 18, 2026</p>
                    <h1>Why Sri Lanka's Healthcare System Desperately Needs Digital Prescriptions</h1>
                    <p className="blog-subtitle">
                        Sri Lanka's healthcare system necessarily needs a digital prescription system because handwritten prescriptions often cause errors, lost records, and long waiting times. Digital prescription systems can make treatment safer, faster, and easier for both doctors and patients.
                    </p>
                </div>
            </div>

            <div className="container blog-shell">
                <article className="blog-article glass-card">
                    <div className="blog-image-block">
                        <img
                            src={blogTitleImg}
                            alt="Patient scanning and managing a medical document on a smartphone"
                        />
                        <p className="image-source">
                            Image source:{' '}
                            <a
                                href="https://www.vecteezy.com/free-photos/notes"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Scan stock photos by Vecteezy
                            </a>
                        </p>
                    </div>

                    <section className="blog-section">
                        <h2>The Problem with Traditional Paper Prescriptions</h2>
                        <p>
                            As far as we see in many clinics and pharmacies across Sri Lanka, paper prescriptions are still the main method doctors use to prescribe medicine. While this system has worked for many years, it also creates several serious problems.
                        </p>
                        <p>
                            One of the biggest issues is handwriting. Many patients struggle to read what their doctor has written. Pharmacists also sometimes find it difficult to understand certain words or medicine names. These confusions ultimately end in a situation where the patient consumes wrong or unnecessary medication. According to the{' '}
                            <a
                                href="https://slmc.gov.lk/en/newstest/46-general-notices-en/524-sri-lanka-medical-council-notice-to-all-registrants-of-the-sri-lanka-medical-council-prescription-writing"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Sri Lanka Medical Council (SLMC)
                            </a>{' '}
                            notice released on November 11th of 2025 (regarding prescription writing), unclear prescriptions have caused much confusion among patients and pharmacists. SLMC stressed the importance of clear handwriting on doctors' part to avoid these mistakes. Digital prescriptions have the potential to eradicate these types of issues.
                        </p>
                        <p>
                            Another common problem is losing prescriptions. Patients, especially elderly, often misplace their paper prescription before reaching the pharmacy or before buying the medicine again. When this happens, they must go back to the doctor to get another copy, which wastes both time and money.
                        </p>
                        <p>
                            We also notice that hospitals and clinics still rely heavily on manual record keeping.{' '}
                            <a
                                href="https://www.researchgate.net/publication/283354699_Assessment_of_legibility_and_completeness_of_prescriptions_dispensed_at_State_Pharmaceutical_Corporation_Anuradhapura"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Research conducted in hospitals in the Anuradhapura area
                            </a>{' '}
                            further highlights this issue. According to the research paper, 99.8% of the prescriptions were handwritten. Paper files can get lost, damaged, or mixed with other records. This makes it difficult for doctors to track a patient's medical history accurately. These types of issues still persist in 2026, highlighting the growing need for digital prescription systems in Sri Lanka.
                        </p>
                    </section>

                    <section className="blog-section">
                        <h2>What Are Digital Prescriptions?</h2>
                        <p>
                            Digital prescriptions, also called electronic prescriptions or e-prescriptions, are prescriptions created and stored digitally instead of being written on paper. When a doctor creates a digital prescription, it is stored in a secure system. The patient or pharmacist can access it through a mobile app, SMS, or online platform.
                        </p>

                        <div className="blog-image-block">
                            <img
                                src={blogTitle2Img}
                                alt="Stack of colorful notes representing organized digital records"
                            />
                            <p className="image-source">
                                Image source:{' '}
                                <a
                                    href="https://www.vecteezy.com/free-photos/notes"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Notes stock photos by vecteezy
                                </a>
                            </p>
                        </div>

                        <p>Electronic prescriptions bring several benefits:</p>
                        <ul>
                            <li>Clear and readable medicine instructions</li>
                            <li>Easy access to past prescriptions</li>
                            <li>Faster communication between doctor and pharmacy</li>
                            <li>Reduced medication errors</li>
                        </ul>
                        <p>In essence, digital prescribing makes the healthcare process more organized and safer.</p>
                    </section>

                    <section className="blog-section">
                        <h2>Major Benefits of Digital Prescription Systems</h2>

                        <h3>1. Reduces Medical Errors</h3>
                        <p>
                            One major advantage of electronic prescriptions is that they reduce mistakes caused by poor handwriting. When doctors type prescriptions digitally, the medicine name, dosage, and instructions are clear. Pharmacists no longer need to guess what is written. Countries that have adapted digital healthcare systems worldwide have a significantly reduced amount of medication errors.
                        </p>

                        <h3>2. Keeps Medical Records Organized</h3>
                        <p>
                            Another benefit of digital prescription platforms is automatic record keeping. With paper prescriptions, patients often keep old prescriptions in files or folders at home. Many lose them over time. With digital systems, every prescription is stored safely in the system. Doctors can quickly check previous medicines and treatment history.
                        </p>

                        <h3>3. Saves Time for Patients and Doctors</h3>
                        <p>
                            Anyone who has visited a busy clinic in Sri Lanka knows how long the whole process can take. Doctors must write prescriptions manually, and pharmacists must carefully read and interpret them. Digital prescriptions speed up this entire process. Doctors can create prescriptions in seconds, and pharmacies can receive them instantly through a well-structured digital system. This reduces waiting time and improves patient experience.
                        </p>

                        <h3>4. Improves Access to Healthcare</h3>
                        <p>
                            In rural areas of Sri Lanka, healthcare access can sometimes be limited. Digital prescription platforms can help bridge this gap. Patients can receive prescriptions digitally even after online consultations or telemedicine appointments. This is especially useful for elderly patients from rural areas who can't travel long distances or people living far from hospitals.
                        </p>
                    </section>

                    <section className="blog-section">
                        <h2>The Growing Need for Digital Health Solutions in Sri Lanka</h2>
                        <p>
                            Sri Lanka has a strong public healthcare system, but it still relies heavily on traditional methods and paperwork. As the population grows and healthcare demand increases, managing everything manually becomes more difficult. We believe adopting digital healthcare tools, especially digital prescription systems, can greatly improve efficiency.
                        </p>
                        <p>
                            Many countries are already using electronic prescriptions successfully. According to an article by the{' '}
                            <a
                                href="https://www.who.int/europe/news/item/02-05-2024-digital-prescriptions---good-for-patients--good-for-prescribers-and-good-for-dispensers"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                World Health Organization (WHO)
                            </a>{' '}
                            82% of Member States routinely make prescriptions electronically available to their populations, which has significantly saved time and money. Sri Lanka also has the opportunity to modernize its healthcare system with innovative digital platforms.
                        </p>
                    </section>

                    <section className="blog-section">
                        <h2>MedHive: A Smart Digital Prescription Solution</h2>
                        <p>
                            Our solution to this problem is the{' '}
                            <a
                                href="https://medhive.lk/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                MedHive
                            </a>{' '}
                            app, a digital healthcare platform designed to simplify prescription management and improve patient care. We believe platforms like MedHive show how technology can solve real healthcare challenges.
                        </p>
                        <p>
                            MedHive allows doctors to create digital prescriptions, which can then be securely shared with patients and pharmacies. This removes the confusion caused by handwritten prescriptions. As a practical step toward full digitalization, MedHive also offers a feature that can convert handwritten prescriptions into digital records simply by capturing a photo.
                        </p>
                    </section>

                    <section className="blog-section">
                        <h2>The Future of Prescriptions in Sri Lanka</h2>
                        <p>
                            Moving toward digital prescriptions is not easy but an important step toward modern healthcare. By replacing paper prescriptions with digital ones, Sri Lanka can:
                        </p>
                        <ul>
                            <li>Reduce medical mistakes</li>
                            <li>Save time in hospitals and pharmacies</li>
                            <li>Improve patient safety</li>
                            <li>Keep better health records</li>
                        </ul>
                        <p>
                            Adopting digital prescription systems today will help build a smarter, safer, and more efficient healthcare system for the future. MedHive represents one possible step toward this much-needed shift in modernizing Sri Lanka's prescription process.
                        </p>
                    </section>

                </article>

                <section className="blog-inquiry-section" id="join">
                    <div className="blog-inquiry-card glass-card">
                        <div className="blog-inquiry-content">
                            <h2>Partner with MedHive</h2>
                            <p>
                                Partner with MedHive to digitize prescriptions and improve care quality.
                                Send us your inquiry and our team will get back to you shortly.
                            </p>
                        </div>
                        <div className="blog-inquiry-form-wrapper">
                            <ContactForm />
                        </div>
                    </div>
                </section>
            </div>

            <style jsx>{`
                .blog-page {
                    padding-top: 60px;
                    background: #fff;
                    min-height: 100vh;
                }

                .blog-header {
                    background: #fff;
                    padding: 60px 0 30px;
                }

                .blog-date {
                    display: inline-flex;
                    padding: 8px 16px;
                    border-radius: 999px;
                    background: rgba(220, 163, 73, 0.14);
                    border: 1px solid rgba(220, 163, 73, 0.24);
                    color: #9a6114;
                    font-size: 14px;
                    font-weight: 700;
                    margin-bottom: 20px;
                }

                .blog-header h1 {
                    font-size: 56px;
                    font-weight: 900;
                    color: #111;
                    margin-bottom: 18px;
                    letter-spacing: -2px;
                    line-height: 1.06;
                    max-width: 1000px;
                }

                .blog-subtitle {
                    font-size: 22px;
                    line-height: 1.65;
                    color: #444;
                    max-width: 1050px;
                    margin: 0;
                    text-align: justify;
                    text-align-last: left;
                }

                .blog-shell {
                    padding-bottom: 100px;
                }

                .blog-inquiry-section {
                    margin: 28px auto 0;
                    display: flex;
                    justify-content: center;
                }

                .blog-inquiry-card {
                    width: 100%;
                    max-width: 940px;
                    padding: 56px 44px;
                    text-align: center;
                    border-radius: 28px;
                    background: linear-gradient(135deg, rgba(220, 163, 73, 0.12) 0%, rgba(220, 163, 73, 0.04) 100%);
                    border: 1px solid rgba(220, 163, 73, 0.2);
                }

                .blog-inquiry-content h2 {
                    font-size: 42px;
                    font-weight: 800;
                    margin-bottom: 16px;
                    color: var(--color-text-primary);
                    letter-spacing: -1px;
                    line-height: 1.2;
                }

                .blog-inquiry-content p {
                    font-size: 18px;
                    line-height: 1.65;
                    color: var(--color-text-secondary);
                    margin: 0 auto 32px;
                    max-width: 700px;
                }

                .blog-inquiry-form-wrapper {
                    display: flex;
                    justify-content: center;
                }

                .blog-article {
                    max-width: 940px;
                    margin: 0 auto;
                    border-radius: 28px;
                    padding: 36px;
                    border: 1px solid rgba(220, 163, 73, 0.12);
                    background: linear-gradient(160deg, rgba(255, 255, 255, 0.95), rgba(252, 251, 248, 0.92));
                }

                .blog-image-block {
                    margin: 0 0 34px;
                }

                .blog-image-block img {
                    width: 100%;
                    height: 300px;
                    object-fit: cover;
                    border-radius: 18px;
                    border: 1px solid rgba(17, 17, 17, 0.06);
                }

                .image-source {
                    margin-top: 10px;
                    font-size: 14px;
                    color: #6b7280;
                }

                .blog-section .image-source {
                    font-size: 14px;
                    line-height: 1.5;
                    margin-top: 10px;
                }

                .blog-section .image-source a {
                    font-size: inherit;
                }

                .blog-section {
                    margin-top: 42px;
                }

                .blog-section h2 {
                    font-size: 34px;
                    font-weight: 800;
                    letter-spacing: -0.5px;
                    color: #111;
                    margin-bottom: 20px;
                    line-height: 1.2;
                }

                .blog-section h3 {
                    font-size: 24px;
                    font-weight: 700;
                    color: #1f2937;
                    margin: 30px 0 14px;
                }

                .blog-section p,
                .blog-section li {
                    font-size: 20px;
                    line-height: 1.85;
                    color: #374151;
                    text-align: justify;
                    text-align-last: left;
                }

                .blog-section p {
                    margin-bottom: 20px;
                }

                .blog-section ul {
                    margin: 8px 0 20px;
                    padding-left: 28px;
                }

                .blog-section li {
                    margin-bottom: 10px;
                }

                a {
                    color: var(--color-primary);
                    text-decoration: none;
                    font-weight: 600;
                    transition: color 0.25s ease;
                }

                a:hover {
                    color: var(--color-primary-dark);
                    text-decoration: underline;
                }

                @media (max-width: 1100px) {
                    .blog-header h1 {
                        font-size: 46px;
                        letter-spacing: -1px;
                    }

                    .blog-subtitle {
                        font-size: 20px;
                    }
                }

                @media (max-width: 900px) {
                    .blog-header {
                        padding: 50px 0 24px;
                    }

                    .blog-header h1 {
                        font-size: 38px;
                    }

                    .blog-subtitle {
                        font-size: 18px;
                    }

                    .blog-article {
                        padding: 24px 20px;
                        border-radius: 22px;
                    }

                    .blog-inquiry-card {
                        padding: 42px 22px;
                        border-radius: 22px;
                    }

                    .blog-inquiry-content h2 {
                        font-size: 30px;
                    }

                    .blog-inquiry-content p {
                        font-size: 16px;
                        margin-bottom: 26px;
                    }

                    .blog-section {
                        margin-top: 34px;
                    }

                    .blog-section h2 {
                        font-size: 30px;
                    }

                    .blog-section h3 {
                        font-size: 22px;
                    }

                    .blog-section p,
                    .blog-section li {
                        font-size: 18px;
                        line-height: 1.75;
                    }

                    .blog-section .image-source {
                        font-size: 13px;
                        line-height: 1.45;
                    }

                    .blog-image-block img {
                        height: 220px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Blog;
