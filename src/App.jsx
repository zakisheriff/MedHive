import React, { useEffect, useState } from "react";
import "./App.css";

// Define a breakpoint. Standard for most responsive designs.
const MOBILE_BREAKPOINT = 900;

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // 1. New state to track if the screen is considered 'mobile'
  const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT);

  // --- Utility Functions ---

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Function to scroll to the top of the app
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Makes the scroll smooth
    });
    closeMobileMenu(); // Close the menu after clicking (good practice)
  };

  // ⭐️ 2. NEW LOGIC: Conditional Logo Click Handler ⭐️
  const handleLogoClick = () => {
    if (isMobile) {
      // Mobile user: Open the menu
      toggleMobileMenu();
    } else {
      // Desktop user: Refresh/Scroll to top
      scrollToTop();
    }
  };

  // --- Effects ---

  // Scroll effect (existing)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3. Effect to track window size for responsive logo behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };

    window.addEventListener("resize", handleResize);
    // Initial check in case the component mounts on a small screen
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty dependency array ensures it runs once on mount and cleanup on unmount


  // --- Render ---

  return (
    <div className="app">
      {/* Navigation */}
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-content">
          <img
            src="logode.png"
            alt="MedHive Logo"
            className="nav-logo-image"
            // ⭐️ 4. Use the new conditional handler ⭐️
            onClick={handleLogoClick}
          />
          <div className="nav-links">
            <a href="#problems">Problems</a>
            <a href="#ai">Solutions</a>
            <a href="#features">Features</a>
            <a href="#contact">Contact</a>
          </div>
          {/* New Profile Circle */}

          {/* End New Profile Circle */}
        </div>
      </nav>

      {/* Mobile Menu Overlay - Still useful for closing on outside click */}
      <div
        className={`mobile-menu-overlay ${mobileMenuOpen ? "active" : ""}`}
        onClick={closeMobileMenu}
      ></div>

      {/* Mobile Menu - THIS WILL BE STYLED AS A MODAL */}
      {/* Note: I added 'glass-card' class here for styling consistency */}
      <div className={`mobile-menu glass-card ${mobileMenuOpen ? "active" : ""}`}>
        <div className="mobile-menu-links">
          {/* ⭐️ NEW HOME LINK ADDED HERE ⭐️
            It uses the new scrollToTop function to go to the app's top.
          */}
          <a onClick={scrollToTop} style={{ cursor: 'pointer' }}>
            Home
          </a>
          <a href="#problems" onClick={closeMobileMenu}>
            Problems
          </a>
          <a href="#ai" onClick={closeMobileMenu}>
            Solutions
          </a>
          <a href="#features" onClick={closeMobileMenu}>
            Features
          </a>
          <a href="#contact" onClick={closeMobileMenu}>
            Contact
          </a>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-gradient"></div>
        <div className="hero-content">
          <div className="hero-card glass-card">
            <h1 className="hero-title animate-fade-in">
              MedHive
            </h1>
            <h1 className="hero-moto animate-fade-in">
              Your Health, Unified. <br />
            </h1>
            <p className="hero-subtitle animate-fade-in-delay">
              MedHive breaks down clinic walls. Instantly connect any doctor in
              any partner clinic to your secure, unified medical timeline using
              a single Med ID, ensuring continuous, safe, and informed care.
            </p>
            <div className="hero-buttons animate-slide-up">
              <a href="#pharma">
                <button className="btn-primary glass-btn">Get Started</button>
              </a>
              <a href="#clinics">
                <button className="btn-secondary glass-btn">
                  See How It Works
                </button>
              </a>
            </div>
          </div>
        </div>
        <div className="wave-divider">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* Problem Section */}
      <section className="problem-section" id="problems">
        <div className="container">
          <h2 className="section-title">Healthcare Challenges in Sri Lanka</h2>
          <div className="problem-grid">
            <div className="problem-card glass-card animate-slide-up">
              <div className="icon-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3>Illegible Prescriptions</h3>
              <p>
                Handwritten prescriptions cause confusion and medication errors
              </p>
            </div>

            <div className="problem-card glass-card animate-slide-up">
              <div className="icon-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3>Lost Health Records</h3>
              <p>
                Patient history scattered across multiple providers with no
                central system
              </p>
            </div>

            <div className="problem-card glass-card animate-slide-up">
              <div className="icon-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3>Pharmacy Errors</h3>
              <p>
                Manual data entry leads to dispensing mistakes and patient harm
              </p>
            </div>

            <div className="problem-card glass-card animate-slide-up">
              <div className="icon-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h3>No Data Insights</h3>
              <p>
                Clinics and pharmacies lack analytics for better decision-making
              </p>
            </div>

            <div className="problem-card glass-card animate-slide-up">
              <div className="icon-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h3>Blind Medicine Imports</h3>
              <p>
                Pharma companies import without understanding real market demand
              </p>
            </div>

            <div className="problem-card glass-card animate-slide-up">
              <div className="icon-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h3>Fragmented Care</h3>
              <p>
                Patients struggle to coordinate care across multiple healthcare
                providers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="solution-section" id="ai">
        <div className="container">
          <h2 className="section-title">The MedHive Ecosystem</h2>
          <div className="solution-grid">
            <div className="solution-card glass-card">
              <div className="solution-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h3>AI Prescription Reader</h3>
              <p>
                Instantly digitize handwritten prescriptions with advanced OCR
              </p>
            </div>

            <div className="solution-card glass-card">
              <div className="solution-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h3>Lab Report Analyzer</h3>
              <p>Extract and track lab values automatically over time</p>
            </div>

            <div className="solution-card glass-card">
              <div className="solution-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h3>Pharmacy Integration</h3>
              <p>Send prescriptions directly to your preferred pharmacy</p>
            </div>

            <div className="solution-card glass-card">
              <div className="solution-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h3>Patient Health History</h3>
              <p>Complete medical timeline accessible with MedHive ID</p>
            </div>

            <div className="solution-card glass-card">
              <div className="solution-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h3>Medicine Reminders</h3>
              <p>Never miss a dose with smart scheduling and alerts</p>
            </div>

            <div className="solution-card glass-card">
              <div className="solution-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h3>Clinic Analytics</h3>
              <p>
                Real-time insights on patient trends and prescribing patterns
              </p>
            </div>

            <div className="solution-card glass-card">
              <div className="solution-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>Pharma Insights</h3>
              <p>Data-driven medicine demand forecasting and market analysis</p>
            </div>

            <div className="solution-card glass-card">
              <div className="solution-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h3>Hospital Access</h3>
              <p>Seamless patient data sharing across healthcare facilities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - UPDATED CONTENT */}
      <section className="features-section" id="features">
        <div className="container">
          <h2 className="section-title">Key Features</h2>
          <div className="features-grid">
            <div className="feature-card glass-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    strokeWidth="2"
                  />
                  <path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2" />
                </svg>
              </div>
              <h3>Scan Prescription</h3>
              <p>
                AI extracts medicine names, dosages, and schedules instantly
                from photos
              </p>
            </div>

            <div className="feature-card glass-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3>Upload Lab Reports</h3>
              <p>
                Automatically extract and track blood work and diagnostic test
                results
              </p>
            </div>

            <div className="feature-card glass-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h3>Send to Clinic</h3>
              <p>
                Forward digital prescriptions directly to the pharmacy inside
                the clinic
              </p>
            </div>

            {/* UPDATED: Complete Health History */}
            <div className="feature-card glass-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h3>Complete Health History</h3>
              <p>
                Access your entire Medical Record and Prescription History
                instantly via your Med ID.
              </p>
            </div>

            {/* NEW/UPDATED: Doctor Consultation Support */}
            <div className="feature-card glass-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 2v6h6m-3-4v8m-3-1v3"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>Doctor Insights & Alerts</h3>
              <p>
                Doctors view Allergies, Past Intake, and Clinical Notes via Med
                ID for better checkups and personalized care.
              </p>
            </div>

            <div className="feature-card glass-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h3>Real-Time Analytics</h3>
              <p>
                Clinics and pharma companies gain actionable insights from
                aggregated data
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - MAJOR REWRITE */}
      <section className="how-it-works" id="clinics">
        <div className="container">
          <h2 className="section-title">MedHive Patient Journey</h2>
          <div className="steps-grid">
            <div className="step-card glass-card">
              <div className="step-number">1</div>
              <div className="step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M3 12l2.239-2.239a2.037 2.037 0 012.871 0L12 14.004l3.89-3.89a2.037 2.037 0 012.872 0L21 12m-9 9V3"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>First Visit: Scan & Sync</h3>
              <p>
                Patient scans the QR code at the doctor's table to access/login
                to the MedHive web app. They grant access to their record and
                upload any existing allergies/history.
              </p>
            </div>

            <div className="step-card glass-card">
              <div className="step-number">2</div>
              <div className="step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3>Prescription Digitization</h3>
              <p>
                After consultation, the handwritten prescription is scanned
                using the app. AI extracts the details, and the digital order is
                immediately sent to the in-house Clinic Pharmacy.
              </p>
            </div>

            <div className="step-card glass-card">
              <div className="step-number">3</div>
              <div className="step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M21 11.5a8.38 8.38 0 01-.25 2.25 8.1 8.1 0 01-1.35 1.76 7.8 7.8 0 01-1.97 1.25l-1.39.63M12 21a9 9 0 01-8.5-4.5M3 11.5A8.5 8.5 0 0111.5 3M12 12a3 3 0 100-6 3 3 0 000 6z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>Next Visit: Med ID Lookup</h3>
              <p>
                For future visits, the patient provides their Med ID. The doctor
                instantly accesses the patient's complete clinical history,
                allergies, and past medication intake for better diagnosis.
              </p>
            </div>
            <div className="step-card glass-card">
              <div className="step-number">4</div>
              <div className="step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M8 12h8m-8 4h8m-8-8h.01M3 21a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4zM12 7V3"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>Seamless Pharmacy & Record Update</h3>
              <p>
                The clinic pharmacy prepares the order, and once dispensed, the
                new prescription details and any doctor's clinical notes are
                automatically saved to the patient's MedHive account.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" id="pharma">
        <div className="cta-card glass-card">
          <h2>Join the future of connected healthcare.</h2>
          <p>
            Be among the first to experience the power of AI-driven health
            management
          </p>
          <button className="btn-cta glass-btn">Get Early Access</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="contact">
        <div className="footer-content">
          <div className="footer-logo">MedHive</div>

          <div className="footer-contact">
            <a href="mailto:reachmedhive@gmail.com" className="footer-email">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  strokeWidth="2"
                />
              </svg>
              reachmedhive@gmail.com
            </a>
          </div>

          <div className="footer-social">
            <a
              href="https://www.linkedin.com/company/medhivelk"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/medhive.lk"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
          </div>

          <div className="footer-links">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="footer-copy">MedHive © 2025</div>
        </div>
      </footer>
    </div>
  );
}

export default App;