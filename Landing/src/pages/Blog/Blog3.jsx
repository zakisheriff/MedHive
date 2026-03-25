import React, { useEffect } from 'react';
import '../../styles/global.css';
import blogTitle6Img from './images/blog-title6.webp';
import blogTitle7Img from './images/blog-title7.webp';
import blogTitle8Img from './images/blog-title8.webp';
import blogTitle9Img from './images/blog-title9.webp';
import blogTitle10Img from './images/blog-title10.webp';
import ContactForm from '../../components/ContactForm/ContactForm';

const Blog3 = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="blog-page">
            <div className="blog-header">
                <div className="container">
                    <p className="blog-date">March 23, 2026</p>
                    <h1>Medication Errors Kill More Than Car Accidents. Why Isn't Anyone Talking About It?</h1>
                    <p className="blog-subtitle">
                        Medication errors often receive less attention than car accidents, even though they can cause serious harm and even death. Because they happen quietly within healthcare systems and are not widely reported or discussed, people are not aware of these unfortunate yet avoidable situations.
                    </p>
                </div>
            </div>

            <div className="container blog-shell">
                <article className="blog-article glass-card">
                    <div className="blog-image-block">
                        <img
                            src={blogTitle6Img}
                            alt="Healthcare-related visual representing medication safety risks"
                        />
                        <p className="image-source">
                            Image source:{' '}
                            <a
                                href="https://www.vecteezy.com/free-photos/biomedical"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Biomedical Stock photos by Vecteezy
                            </a>
                        </p>
                    </div>

                    <section className="blog-section">
                        <h2>The Hidden Danger of Medication Errors</h2>
                        <p>
                            Medication errors are one of the most overlooked problems in healthcare. Unlike car accidents, which are visible and widely reported, medication mistakes happen quietly under the radar.
                        </p>
                        <p>These types of errors commonly include:</p>
                        <ul>
                            <li>Wrong medicine given</li>
                            <li>Incorrect dosage</li>
                            <li>Misreading prescriptions</li>
                            <li>Missed instructions</li>
                        </ul>
                        <p>
                            Since these errors happen out of sight, they rarely get attention. But in reality, their impact can be just as serious, if not worse.
                        </p>
                    </section>

                    <section className="blog-section">
                        <h2>Why Medication Errors Are So Common</h2>
                        <h3>1. Poor Handwriting and Miscommunication</h3>
                        <p>
                            One of the most common causes of medication errors is unclear handwriting.
                        </p>
                        <p>
                            Doctors often write prescriptions quickly, and sometimes the writing is difficult to read. Pharmacists and patients may misunderstand the instructions.
                        </p>
                        <p>
                            In the healthcare world, even a small misunderstanding in a medicine name or dosage can lead to harmful results.
                        </p>

                        <h3>2. Lack of Proper Record Keeping</h3>
                        <p>
                            Many healthcare systems still rely on paper records.
                        </p>
                        <p>
                            When patient information is not well organized, doctors lose access to complete medical history of their patients. This increases the chance of prescribing the wrong medicine.
                        </p>
                        <p>
                            Doctors usually expect patients to be aware of and share the important details about their medical history. This is why{' '}
                            <a
                                href="https://www.ama-assn.org/public-health/prevention-wellness/what-doctors-wish-patients-knew-about-their-family-health-history"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                awareness of family health history
                            </a>{' '}
                            is strongly encouraged.
                        </p>
                        <p>
                            Hence, digital record keeping helps both doctors and patients by making information easier to access and understand.
                        </p>

                        <div className="blog-image-block">
                            <img
                                src={blogTitle7Img}
                                alt="Medical records and table setup representing organized documentation"
                            />
                            <p className="image-source">
                                Image source:{' '}
                                <a
                                    href="https://www.vecteezy.com/free-photos/table"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Table Stock photos by Vecteezy
                                </a>
                            </p>
                        </div>

                        <h3>3. High Workload in Clinics and Hospitals</h3>
                        <p>
                            Healthcare professionals often work under pressure.
                        </p>
                        <p>
                            Busy clinics and hospitals handle many patients every day. In such environments, mistakes can happen more easily.
                        </p>
                        <p>
                            Using digital systems reduces workload pressure and gives healthcare professionals more time to focus on patient care.
                        </p>
                        <p>
                            <a
                                href="https://link.springer.com/content/pdf/10.1186/s12912-024-01936-7.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Research
                            </a>{' '}
                            shows that introducing electronic medical record systems can help reduce workload and lower medication errors, allowing healthcare professionals to manage their tasks more efficiently.
                        </p>
                    </section>

                    <section className="blog-section">
                        <h2>Why This Issue Is Not Widely Discussed</h2>
                        <h3>It Happens Quietly</h3>
                        <p>
                            Unlike accidents on the road, medication errors do not happen in public. They occur in private spaces like clinics and hospitals, making them less visible to society.
                        </p>
                        <p>
                            There should be greater transparency in healthcare systems, as patients have the right to be informed about their care.
                        </p>

                        <div className="blog-image-block">
                            <img
                                src={blogTitle8Img}
                                alt="Unwell patient illustrating hidden healthcare risks"
                            />
                            <p className="image-source">
                                Image source:{' '}
                                <a
                                    href="https://www.vecteezy.com/free-photos/unwell"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Unwell Stock photos by Vecteezy
                                </a>
                            </p>
                        </div>

                        <h3>Lack of Public Awareness</h3>
                        <p>
                            Many people are simply not aware of how common medication errors are.
                        </p>
                        <p>
                            Patients often trust prescriptions without questioning them, which is understandable but also risky.
                        </p>
                        <p>
                            In many cases, healthcare providers may not report errors due to fear or lack of proper systems. This makes the problem less visible.
                        </p>
                        <p>
                            This is one of the main reasons the issue is often overlooked, which makes raising awareness even more important.
                        </p>

                        <h3>No Strong Digital Systems in Place</h3>
                        <p>
                            Another major reason for these errors is the lack of digital systems in many healthcare settings. Without digital support, everything depends on manual processes, which are more prone to mistakes.
                        </p>
                    </section>

                    <section className="blog-section">
                        <h2>How Digital Solutions Can Reduce Medication Errors</h2>
                        <h3>Clear and Accurate Prescriptions</h3>
                        <p>
                            Digital prescriptions remove the problem of poor handwriting. Doctors can type prescriptions clearly, making them easy to understand for both patients and pharmacists.
                        </p>

                        <h3>Better Access to Patient History</h3>
                        <p>
                            Digital systems store patient records in one place. Doctors can quickly check allergies, past medicines, and treatments before prescribing new medication. It helps avoid dangerous drug interactions.
                        </p>

                        <div className="blog-image-block">
                            <img
                                src={blogTitle9Img}
                                alt="Doctor using digital systems for safer prescribing"
                            />
                            <p className="image-source">
                                Image source:{' '}
                                <a
                                    href="https://www.vecteezy.com/free-photos/doctor"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Doctor Stock photos by Vecteezy
                                </a>
                            </p>
                        </div>

                        <h3>Improved Communication</h3>
                        <p>
                            Digital healthcare systems allow better communication between doctors, patients, and pharmacies. This reduces misunderstandings and ensures the right medicine is given.
                        </p>
                    </section>

                    <section className="blog-section">
                        <h2>MedHive: A Practical Solution to Reduce Medication Errors</h2>
                        <p>
                            As healthcare moves toward digital solutions, platforms like the{' '}
                            <a
                                href="https://medhive.lk/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                MedHive app
                            </a>{' '}
                            offer a practical way to address medication errors.
                        </p>
                        <p>
                            MedHive focuses on improving prescription accuracy and overall healthcare efficiency by providing a unified platform for doctors, patients, and pharmacists.
                        </p>

                        <h3>Key Features That Help Reduce Errors</h3>
                        <h4>Digital Prescriptions</h4>
                        <p>
                            Doctors can create clear and accurate prescriptions, reducing confusion caused by handwriting.
                        </p>

                        <h4>Convert Handwritten Prescriptions</h4>
                        <p>
                            As a transitional step, MedHive allows users to convert handwritten prescriptions into digital format by simply taking a photo. This feature is especially useful in settings that still rely on paper.
                        </p>

                        <h4>Easy Access for Patients</h4>
                        <p>
                            Patients can view their prescriptions anytime, reducing the risk of losing important information. As patient data is stored safely, doctors and patients have access to specific medical history when needed.
                        </p>

                        <div className="blog-image-block">
                            <img
                                src={blogTitle10Img}
                                alt="Digital healthcare interface supporting patient access"
                            />
                        </div>
                    </section>

                    <section className="blog-section">
                        <h2>What We Can Do Moving Forward</h2>
                        <p>
                            Reducing medication errors requires a combination of both awareness and better systems.
                        </p>
                        <p>
                            There is no doubt that medication errors are a serious issue that deserves greater attention.
                        </p>
                        <p>
                            The reason people are not talking about it enough is because it happens quietly and lacks visibility.
                        </p>
                        <p>
                            However, with the right approach, especially by adopting digital solutions like MedHive and spreading awareness among patients, healthcare systems can reduce errors and provide safer, more reliable care for everyone.
                        </p>
                    </section>
                </article>

                <section className="blog-inquiry-section" id="join">
                    <div className="blog-inquiry-card glass-card">
                        <div className="blog-inquiry-content">
                            <h2>Partner with MedHive</h2>
                            <p>
                                Partner with MedHive to digitize records and prescriptions in your clinic.
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
                    background: #fff;
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
                    background: #fff;
                }

                .blog-image-block {
                    margin: 0 0 34px;
                }

                .blog-image-block img {
                    width: 100%;
                    height: 460px;
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
                    font-size: 25px;
                    font-weight: 700;
                    color: #111;
                    margin-top: 26px;
                    margin-bottom: 12px;
                    line-height: 1.35;
                }

                .blog-section h4 {
                    font-size: 22px;
                    font-weight: 700;
                    color: #1f2937;
                    margin-top: 20px;
                    margin-bottom: 10px;
                    line-height: 1.4;
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
                    }

                    .blog-image-block img {
                        height: 360px;
                    }

                    .blog-section h2 {
                        font-size: 28px;
                    }

                    .blog-section h3 {
                        font-size: 22px;
                    }

                    .blog-section h4 {
                        font-size: 20px;
                    }

                    .blog-section p,
                    .blog-section li {
                        font-size: 18px;
                        line-height: 1.75;
                    }

                    .blog-inquiry-card {
                        padding: 34px 20px;
                    }

                    .blog-inquiry-content h2 {
                        font-size: 30px;
                    }
                }

                @media (max-width: 600px) {
                    .blog-page {
                        padding-top: 52px;
                    }

                    .blog-header h1 {
                        font-size: 31px;
                        line-height: 1.15;
                    }

                    .blog-subtitle {
                        font-size: 17px;
                        line-height: 1.7;
                    }

                    .blog-section {
                        margin-top: 34px;
                    }

                    .blog-section h2 {
                        font-size: 25px;
                    }

                    .blog-section h3 {
                        font-size: 21px;
                    }

                    .blog-section h4 {
                        font-size: 19px;
                    }

                    .blog-section p,
                    .blog-section li {
                        font-size: 17px;
                    }

                    .blog-image-block img {
                        height: 310px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Blog3;
