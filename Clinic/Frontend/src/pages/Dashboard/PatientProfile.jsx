import React from 'react';
import { motion } from 'framer-motion';
import './css/PatientProfile.css';

const PatientProfile = ({ patientId }) => {
  return (
    <motion.div className="medical-profile-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      
      {/* 1. Patient Header (Enhanced) */}
      <section className="profile-header-strip">
        <div className="header-main">
          <h2>Abdul Raheem <span className="p-id">ID: {patientId}</span></h2>
          <p className="sub-meta">28 | Male • <strong>O+ Blood Group</strong></p>
          <div className="secondary-meta">
            <span>Primary Doctor: Dr. K. Perera</span>
            <span className="insurance-tag active">Insurance: Active</span>
          </div>
        </div>
        <div className="emergency-box">
          <label>Emergency Contact</label>
          <p>+94 77 123 4567 (Father)</p>
        </div>
      </section>

      {/* 2. Critical Medical Flags (High Visibility) */}
      <section className="flags-container">
        <div className="flag-chip high-risk">Cardiac: Grade 1</div>
        <div className="flag-chip warning">Do-Not-Prescribe: NSAIDs</div>
        <div className="flag-chip allergy">Allergy: Penicillin (Anaphylaxis)</div>
        <div className="flag-chip condition">Chronic: Type 2 Diabetes</div>
      </section>

      {/* 3. Vital & Diagnostic Snapshot (NEW) */}
      <section className="vital-snapshot">
        <div className="vital-tile">
          <label>Blood Pressure</label>
          <p className="value">128/84 <span className="trend">Stable</span></p>
        </div>
        <div className="vital-tile">
          <label>HbA1c / Sugar</label>
          <p className="value">6.8% <span className="unit">HbA1c</span></p>
        </div>
        <div className="vital-tile">
          <label>Current Weight</label>
          <p className="value">74.5 <span className="unit">kg</span></p>
        </div>
        <div className="vital-tile abnormal">
          <label>Last Abnormal Lab</label>
          <p className="value">Low Vit-D <span className="date">01/26</span></p>
        </div>
      </section>

      <div className="profile-grid">
        <div className="profile-main-col">
          {/* 4. Current Medications */}
          <div className="medications-section">
            <h3>Active Medications</h3>
            <div className="med-grid">
              <div className="med-card-detailed high-risk">
                <div className="med-header">
                  <strong>Metformin 500mg</strong>
                  <span className="risk-tag">High Risk</span>
                </div>
                <p>1-0-1 (Post-Meal) • Started: 12/2024</p>
                <small>Prescribed by: Dr. J. Silva (Endocrinology)</small>
              </div>
            </div>
          </div>

          {/* 5. Medical Timeline */}
          <div className="timeline-section">
            <h3>Medical Timeline</h3>
            <div className="timeline">
              <div className="timeline-item">
                <span className="date">Feb 01, 2026</span>
                <div className="dot active"></div>
                <div className="content">
                  <h4>Routine Diabetic Review</h4>
                  <p>General Medicine • MedHive Clinic • <strong>OPD</strong></p>
                  <button className="view-presc-btn">View Prescription</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-side-col">
          {/* 6. Quick Medical Insights */}
          <div className="side-card insights">
            <h4>Clinical Insights</h4>
            <div className="insight-row"><span>Diabetes Duration</span> <strong>6 Years</strong></div>
            <div className="insight-row"><span>Repeat Visits</span> <strong>No</strong></div>
            <div className="insight-row"><span>Last Hospitalized</span> <strong>11/2023</strong></div>
          </div>

          {/* 7. Preventive & Risk */}
          <div className="side-card lifestyle">
            <h4>Preventive Status</h4>
            <div className="lifestyle-row"><span>Smoking</span> <strong>No</strong></div>
            <div className="lifestyle-row"><span>Alcohol</span> <strong>Social</strong></div>
            <div className="lifestyle-row"><span>Vaccines</span> <strong className="status-up">Up to date</strong></div>
          </div>

          {/* 8. Documents */}
          <div className="side-card documents">
            <h4>Documents</h4>
            <div className="doc-link">Lab Report <span className="tag critical">Critical</span></div>
            <div className="doc-link">Discharge Summary <span className="tag hospital">Hospital</span></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PatientProfile;