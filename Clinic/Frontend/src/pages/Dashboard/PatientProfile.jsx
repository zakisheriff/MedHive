import React from 'react';
import './PatientProfile.css';

const PatientProfile = ({ patientId }) => {
  return (
    <motion.div className="medical-profile-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      
      {/* 1. Header (Always Visible) */}
      <section className="profile-header-strip">
        <div className="header-main">
          <h2>Abdul Raheem</h2>
          <p>28 | Male • <strong>O+ Blood Group</strong></p>
          <span className="p-id">ID: {patientId}</span>
        </div>
        <div className="emergency-box">
          <label>Emergency Contact</label>
          <p>+94 77 123 4567 (Father)</p>
        </div>
      </section>

      {/* 2. Critical Medical Alerts */}
      <section className="alerts-section">
        <div className="alert-badge allergy">Known Allergies: Penicillin, Peanuts</div>
        <div className="alert-badge condition">Chronic: Type 2 Diabetes</div>
      </section>

      <div className="profile-grid">
        {/* 3. Timeline / Recent History */}
        <div className="profile-main-col">
          <h3>Medical Timeline</h3>
          <div className="timeline">
            <div className="timeline-item">
              <span className="date">Oct 12, 2025</span>
              <div className="dot"></div>
              <div className="content">
                <h4>Upper Respiratory Infection</h4>
                <p>Type: OPD • Dr. Perera</p>
                <button className="mini-link">View Prescription</button>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Medications & Insights */}
        <div className="profile-side-col">
          <div className="insight-card">
            <h4>Quick Insights</h4>
            <ul>
              <li>Last Visit: 12 days ago</li>
              <li>Hospitalizations: 0</li>
              <li>Active Meds: 2</li>
            </ul>
          </div>
          
          <div className="meds-card">
            <h4>Current Medications</h4>
            <div className="med-row">
              <strong>Metformin 500mg</strong>
              <span>1-0-1 (Post Meal)</span>
            </div>
          </div>
        </div>
      </div>

    </motion.div>
  );
};

export default PatientProfile;