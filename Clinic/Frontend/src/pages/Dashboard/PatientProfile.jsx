import React from 'react';
import { motion } from 'framer-motion';
import './css/PatientProfile.css';

const PatientProfile = () => {
  const patient = {
    med_id: "MH001",
    fname: "John",
    lname: "Doe",
    date_of_birth: "1995-05-15",
    gender: "Male",
    email: "john@gmail.com",
    phone_number: "077 123 4567",
    district: "Colombo",
    province: "Western",
    blood_group: "O+",
    allergies: "Penicillin, Peanuts",
    chronic_diseases: "Hypertension (Mild)",
    vitals: {
      bp: "128/84",
      hr: "76 bpm",
      spo2: "98%",
      temp: "36.8°C"
    }
  };

  const prescriptions = [
    {
      prescription_id: 101,
      status: "Verified",
      created_at: "2024-03-10T10:00:00Z",
      high_risk: false,
      medicines: [
        { name: "Amoxicillin", dosage: "500mg", frequency: "3 times daily" },
        { name: "Paracetamol", dosage: "1g", frequency: "When needed" }
      ]
    },
    {
      prescription_id: 102,
      status: "Active",
      created_at: "2024-03-18T14:30:00Z",
      high_risk: true,
      medicines: [
        { name: "Cetirizine", dosage: "10mg", frequency: "Once at night" }
      ]
    }
  ];

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <motion.div className="medical-profile-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      
      {/* 1. Patient Header */}
      <section className="profile-header-strip">
        <div className="header-main">
          <h2>{patient.fname} {patient.lname} <span className="p-id">ID: {patient.med_id}</span></h2>
          <p className="sub-meta">{calculateAge(patient.date_of_birth)} | {patient.gender} • <strong>{patient.district}, {patient.province}</strong></p>
          <div className="secondary-meta">
            <span>Email: {patient.email}</span>
            <span className="insurance-tag active">Status: Verified</span>
          </div>
        </div>
        <div className="emergency-box">
          <label>Contact Info</label>
          <p>{patient.phone_number}</p>
        </div>
      </section>

      {/* 2. Flags Section (Strict Hierarchy) */}
      <div className="flags-container">
        <span className="flag-chip high-risk">CRITICAL: TACHYCARDIA RISK</span>
        <span className="flag-chip allergy">ALLERGY: {patient.allergies}</span>
        <span className="flag-chip warning">CHRONIC: {patient.chronic_diseases}</span>
      </div>

      {/* 3. Vital Snapshot Grid */}
      <div className="vital-snapshot">
        <div className="vital-tile">
          <label>Blood Pressure</label>
          <p className="value">{patient.vitals.bp}</p>
        </div>
        <div className="vital-tile">
          <label>Heart Rate</label>
          <p className="value">{patient.vitals.hr}</p>
        </div>
        <div className="vital-tile">
          <label>SpO2</label>
          <p className="value">{patient.vitals.spo2}</p>
        </div>
        <div className="vital-tile">
          <label>Temperature</label>
          <p className="value">{patient.vitals.temp}</p>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-main-col">
          {/* 4. Medical History / Prescriptions */}
          <div className="medications-section">
            <h3 style={{ padding: '0 40px', marginBottom: '15px' }}>Recent Prescriptions ({prescriptions.length})</h3>
            <div className="med-grid" style={{ padding: '0 40px' }}>
              {prescriptions.map((presc) => (
                <div key={presc.prescription_id} className={`med-card-detailed ${presc.high_risk ? 'high-risk' : ''}`}>
                  <div className="med-header">
                    <strong>Prescription #{presc.prescription_id}</strong>
                    <span className="risk-tag">{presc.status}</span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '10px' }}>
                    Date: {new Date(presc.created_at).toLocaleDateString()}
                  </p>
                  <div className="medicines-list">
                    {presc.medicines.map((m, idx) => (
                      <div key={idx} className="med-item" style={{ fontSize: '15px', padding: '4px 0' }}>
                        • <strong>{m.name}</strong> ({m.dosage}) - {m.frequency}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="profile-side-col">
          {/* 5. Patient Details Card */}
          <div className="side-card insights" style={{ margin: '0 40px 0 0' }}>
            <h4>Patient Profile</h4>
            <div className="insight-row"><span>Blood Group</span> <strong>{patient.blood_group}</strong></div>
            <div className="insight-row"><span>Gender</span> <strong>{patient.gender}</strong></div>
            <div className="insight-row"><span>District</span> <strong>{patient.district}</strong></div>
            <div className="insight-row"><span>Province</span> <strong>{patient.province}</strong></div>
            <div className="insight-row"><span>Allergies</span> <strong style={{ color: '#dc2626' }}>{patient.allergies}</strong></div>
            <div className="insight-row"><span>Chronic</span> <strong>{patient.chronic_diseases}</strong></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PatientProfile;