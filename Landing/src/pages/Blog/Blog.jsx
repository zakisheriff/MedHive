import React, { useEffect } from 'react';
import '../../styles/global.css';

const Blog = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="blog-page">
            <div className="blog-header">
                <div className="container">
                    <h1>Blog</h1>
                    <p className="subtitle">Insights and updates from MedHive</p>
                </div>
            </div>

            <div className="container blog-content">
                <article className="blog-article">
                    <header className="article-header">
                        <h2>Why Sri Lanka’s Healthcare System Desperately Needs Digital Prescriptions</h2>
                        <div className="article-meta">
                            <span className="date">March 18, 2026</span>
                        </div>
                    </header>

                    <div className="article-body">
                        <p>Sri Lanka’s healthcare system necessarily needs a digital prescription system because handwritten prescriptions often cause errors, lost records, and long waiting times. Digital prescription systems can make treatment safer, faster, and easier for both doctors and patients.</p>

                        <h3>The Problem with Traditional Paper Prescriptions</h3>
                        <p>As far as we see in many clinics and pharmacies across Sri Lanka, paper prescriptions are still the main method doctors use to prescribe medicine. While this system has worked for many years, it also creates several serious problems.</p>
                        <p>One of the biggest issues is handwriting. Many patients struggle to read what their doctor has written. Pharmacists also sometimes find it difficult to understand certain words or medicine names. These confusions ultimately end in a situation where the patient consumes wrong or unnecessary medication. According to Sri Lanka Medical Council’s (SLMC) notice released on November 11th of 2025 (regarding prescription writing), unclear prescriptions have caused much confusion among patients and pharmacists. SLMC stressed the importance of clear handwriting on doctors’ part to avoid these mistakes. Digital prescriptions have the potential to eradicate these types of issues.</p>
                        <p>Another common problem is losing prescriptions. Patients, especially elderly, often misplace their paper prescription before reaching the pharmacy or before buying the medicine again. When this happens, they must go back to the doctor to get another copy, which wastes both time and money.</p>
                        <p>We also notice that hospitals and clinics still rely heavily on manual record keeping. Paper files can get lost, damaged, or mixed with other records. This makes it difficult for doctors to track a patient’s medical history accurately. These types of issues still persist in 2026, highlighting the growing need for digital prescription systems in Sri Lanka.</p>

                        <h3>What Are Digital Prescriptions?</h3>
                        <p>Digital prescriptions, also called electronic prescriptions or e-prescriptions, are prescriptions created and stored digitally instead of being written on paper. When a doctor creates a digital prescription, it is stored in a secure system. The patient or pharmacist can access it through a mobile app, SMS, or online platform.</p>
                        <p>Electronic prescriptions bring several benefits:</p>
                        <ul>
                            <li>Clear and readable medicine instructions</li>
                            <li>Easy access to past prescriptions</li>
                            <li>Faster communication between doctor and pharmacy</li>
                            <li>Reduced medication errors</li>
                        </ul>
                        <p>In essence, digital prescribing makes the healthcare process more organized and safer.</p>

                        <h3>Major Benefits of Digital Prescription Systems</h3>
                        
                        <h4>1. Reduces Medical Errors</h4>
                        <p>One major advantage of electronic prescriptions is that they reduce mistakes caused by poor handwriting. When doctors type prescriptions digitally, the medicine name, dosage, and instructions are clear. Pharmacists no longer need to guess what is written. Countries that have adapted digital healthcare systems worldwide have a significantly reduced amount of medication errors.</p>

                        <h4>2. Keeps Medical Records Organized</h4>
                        <p>Another benefit of digital prescription platforms is automatic record keeping. With paper prescriptions, patients often keep old prescriptions in files or folders at home. Many lose them over time. With digital systems, every prescription is stored safely in the system. Doctors can quickly check previous medicines and treatment history.</p>

                        <h4>3. Saves Time for Patients and Doctors</h4>
                        <p>Anyone who has visited a busy clinic in Sri Lanka knows how long the whole process can take. Doctors must write prescriptions manually, and pharmacists must carefully read and interpret them. Digital prescriptions speed up this entire process. Doctors can create prescriptions in seconds, and pharmacies can receive them instantly through a well-structured digital system. This reduces waiting time and improves patient experience.</p>

                        <h4>4. Improves Access to Healthcare</h4>
                        <p>In rural areas of Sri Lanka, healthcare access can sometimes be limited. Digital prescription platforms can help bridge this gap. Patients can receive prescriptions digitally even after online consultations or telemedicine appointments. This is especially useful for elderly patients from rural areas who can’t travel long distances or people living far from hospitals.</p>

                        <h3>The Growing Need for Digital Health Solutions in Sri Lanka</h3>
                        <p>Sri Lanka has a strong public healthcare system, but it still relies heavily on traditional methods and paperwork. As the population grows and healthcare demand increases, managing everything manually becomes more difficult. We believe adopting digital healthcare tools, especially digital prescription systems, can greatly improve efficiency. Many countries are already using electronic prescriptions successfully. Sri Lanka also has the opportunity to modernize its healthcare system with innovative digital platforms.</p>

                        <h3>MedHive: A Smart Digital Prescription Solution</h3>
                        <p>Our solution to this problem is the MedHive app, a digital healthcare platform designed to simplify prescription management and improve patient care. We believe platforms like MedHive show how technology can solve real healthcare challenges.</p>
                        <p>MedHive allows doctors to create digital prescriptions, which can then be securely shared with patients and pharmacies. This removes the confusion caused by handwritten prescriptions. As a practical step toward full digitalization, MedHive also offers a feature that can convert handwritten prescriptions into digital records simply by capturing a photo.</p>

                        <h4>Key Advantages of MedHive</h4>
                        <ul>
                            <li><strong>Easy Prescription Access:</strong> Patients can view their prescriptions directly through the app. This means no more lost paper prescriptions.</li>
                            <li><strong>Better Medication Tracking:</strong> Patients can keep track of their medicines and treatment history in one unified place.</li>
                            <li><strong>Faster Communication:</strong> Doctors, patients, and pharmacies can connect more easily through the digital system.</li>
                            <li><strong>Secure Digital Records:</strong> All prescriptions and medical data are stored safely, helping doctors access patient history when needed.</li>
                        </ul>
                        <p>We strongly believe that solutions like MedHive would help improve prescription accuracy and make healthcare processes more efficient.</p>

                        <h3>The Future of Prescriptions in Sri Lanka</h3>
                        <p>Moving toward digital prescriptions is not easy but an important step toward modern healthcare. By replacing paper prescriptions with digital ones, Sri Lanka can:</p>
                        <ul>
                            <li>Reduce medical mistakes</li>
                            <li>Save time in hospitals and pharmacies</li>
                            <li>Improve patient safety</li>
                            <li>Keep better health records</li>
                        </ul>
                        <p>Adopting digital prescription systems today will help build a smarter, safer, and more efficient healthcare system for the future. MedHive represents one possible step toward this much-needed shift in modernizing Sri Lanka’s prescription process.</p>
                    </div>
                </article>
            </div>

            <style jsx>{`
                .blog-page {
                    padding-top: 60px;
                    background: #fff;
                    min-height: 100vh;
                }
                .blog-header {
                    background: #fff;
                    padding: 60px 0 50px;
                    text-align: center;
                    margin-bottom: 50px;
                }
                .blog-header h1 {
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
                .blog-content {
                    max-width: 800px;
                    padding-bottom: 100px;
                    margin: 0 auto;
                }
                .blog-article {
                    background: #fff;
                }
                .article-header {
                    margin-bottom: 40px;
                    text-align: center;
                }
                .article-header h2 {
                    font-size: 36px;
                    font-weight: 800;
                    color: #111;
                    margin-bottom: 15px;
                    line-height: 1.3;
                }
                .article-meta {
                    color: #888;
                    font-size: 14px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .article-body {
                    font-size: 18px;
                    line-height: 1.8;
                    color: #333;
                }
                .article-body p {
                    margin-bottom: 24px;
                }
                .article-body h3 {
                    font-size: 28px;
                    font-weight: 700;
                    color: #111;
                    margin: 40px 0 20px;
                }
                .article-body h4 {
                    font-size: 22px;
                    font-weight: 700;
                    color: #222;
                    margin: 30px 0 15px;
                }
                .article-body ul {
                    margin-bottom: 24px;
                    padding-left: 20px;
                }
                .article-body li {
                    margin-bottom: 10px;
                }
                .article-body strong {
                    color: #111;
                }
                
                @media (max-width: 900px) {
                    .blog-header {
                        padding: 60px 0;
                    }
                    .blog-header h1 {
                        font-size: 42px;
                    }
                    .article-header h2 {
                        font-size: 28px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Blog;
