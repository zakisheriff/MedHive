import React from 'react';
import { motion } from 'framer-motion';
import './css/PatientProfile.css';

const PatientProfile = ({ data }) => {
  const patient = data?.patient || null;
  const prescriptions = data?.prescriptions || [];

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  if (!patient) {
    return (
      <div className="medical-profile-card">
        <h2>No patient data found.</h2>
      </div>
    );
  }

  return (
    <motion.div
      className="medical-profile-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <section className="profile-header-strip">
        <div className="header-main">
          <h2>
            {patient.fname} {patient.lname}{' '}
            <span className="p-id">ID: {patient.med_id}</span>
          </h2>

          <p className="sub-meta">
            {calculateAge(patient.date_of_birth)} | {patient.gender || 'N/A'} •{' '}
            <strong>{patient.district || 'N/A'}, {patient.province || 'N/A'}</strong>
          </p>

          <div className="secondary-meta">
            <span>Email: {patient.email || 'N/A'}</span>
            <span className="insurance-tag active">Status: Verified</span>
          </div>
        </div>

        <div className="emergency-box">
          <label>Contact Info</label>
          <p>{patient.phone_number || 'N/A'}</p>
        </div>
      </section>

      <div className="flags-container">
        {patient.allergies && (
          <span className="flag-chip allergy">ALLERGY: {patient.allergies}</span>
        )}

        {patient.diseases && (
          <span className="flag-chip warning">DISEASES: {patient.diseases}</span>
        )}

        {patient.medical_records && (
          <span className="flag-chip high-risk">
            MEDICAL RECORDS: {patient.medical_records}
          </span>
        )}
      </div>

      <div className="vital-snapshot">
        <div className="vital-tile">
          <label>Blood Pressure</label>
          <p className="value">{patient.blood_pressure || 'N/A'}</p>
        </div>

        <div className="vital-tile">
          <label>Blood Group</label>
          <p className="value">{patient.blood_group || 'N/A'}</p>
        </div>

        <div className="vital-tile">
          <label>Weight</label>
          <p className="value">
            {patient.weight_kg ? `${patient.weight_kg} kg` : 'N/A'}
          </p>
        </div>

        <div className="vital-tile">
          <label>Date of Birth</label>
          <p className="value">
            {patient.date_of_birth
              ? new Date(patient.date_of_birth).toLocaleDateString()
              : 'N/A'}
          </p>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-main-col">
          <div className="medications-section">
            <h3 style={{ padding: '0 40px', marginBottom: '15px' }}>
              Recent Prescriptions ({prescriptions.length})
            </h3>

            <div className="med-grid" style={{ padding: '0 40px' }}>
              {prescriptions.length > 0 ? (
                prescriptions.map((presc) => (
                  <div key={presc.prescription_id} className="med-card-detailed">
                    <div className="med-header">
                      <strong>Prescription #{presc.prescription_id}</strong>
                      <span className="risk-tag">{presc.status || 'N/A'}</span>
                    </div>

                    <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '10px' }}>
                      Date:{' '}
                      {presc.created_at
                        ? new Date(presc.created_at).toLocaleDateString()
                        : 'N/A'}
                    </p>

                    {presc.prescription_image_url && (
                      <p style={{ marginBottom: '10px' }}>
                        <strong>Image:</strong>{' '}
                        <a
                          href={presc.prescription_image_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View Prescription
                        </a>
                      </p>
                    )}

                    <div className="medicines-list">
                      <div
                        className="med-item"
                        style={{ fontSize: '15px', padding: '4px 0', whiteSpace: 'pre-wrap' }}
                      >
                        <strong>AI Output:</strong>{' '}
                        {presc.raw_ai_output || 'No extracted prescription text available.'}
            <h3 className="section-title">Recent Prescriptions ({prescriptions.length})</h3>
            <div className="med-grid">
              {prescriptions.map((presc) => (
                <div key={presc.prescription_id} className={`med-card-detailed ${presc.high_risk ? 'high-risk' : ''}`}>
                  <div className="med-header">
                    <strong>Prescription #{presc.prescription_id}</strong>
                    <span className="risk-tag">{presc.status}</span>
                  </div>
                  <p className="presc-date">
                    Date: {new Date(presc.created_at).toLocaleDateString()}
                  </p>
                  <div className="medicines-list">
                    {presc.medicines.map((m, idx) => (
                      <div key={idx} className="med-item">
                        • <strong>{m.name}</strong> ({m.dosage}) - {m.frequency}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ padding: '0 40px' }}>No prescriptions found.</p>
              )}
            </div>
          </div>
        </div>

        <div className="profile-side-col">
          <div className="side-card insights" style={{ margin: '0 40px 0 0' }}>
            <h4>Patient Profile</h4>

            <div className="insight-row">
              <span>Blood Group</span>
              <strong>{patient.blood_group || 'N/A'}</strong>
            </div>

            <div className="insight-row">
              <span>Gender</span>
              <strong>{patient.gender || 'N/A'}</strong>
            </div>

            <div className="insight-row">
              <span>District</span>
              <strong>{patient.district || 'N/A'}</strong>
            </div>

            <div className="insight-row">
              <span>Province</span>
              <strong>{patient.province || 'N/A'}</strong>
            </div>

            <div className="insight-row">
              <span>Allergies</span>
              <strong style={{ color: '#dc2626' }}>{patient.allergies || 'N/A'}</strong>
            </div>

            <div className="insight-row">
              <span>Diseases</span>
              <strong>{patient.diseases || 'N/A'}</strong>
            </div>

            <div className="insight-row">
              <span>Medical Records</span>
              <strong>{patient.medical_records || 'N/A'}</strong>
            </div>

            <div className="insight-row">
              <span>Other Info</span>
              <strong>{patient.other_info || 'N/A'}</strong>
            </div>
          {/* 5. Patient Details Card */}
          <div className="side-card insights">
            <h4>Patient Profile</h4>
            <div className="insight-row"><span>Blood Group</span> <strong>{patient.blood_group}</strong></div>
            <div className="insight-row"><span>Gender</span> <strong>{patient.gender}</strong></div>
            <div className="insight-row"><span>District</span> <strong>{patient.district}</strong></div>
            <div className="insight-row"><span>Province</span> <strong>{patient.province}</strong></div>
            <div className="insight-row"><span>Allergies</span> <strong className="text-critical">{patient.allergies}</strong></div>
            <div className="insight-row"><span>Chronic</span> <strong>{patient.chronic_diseases}</strong></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PatientProfile;