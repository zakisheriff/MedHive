import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/PatientHistory.css';

const PatientHistory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy data (replace with backend later)
  const patientHistory = [
    {
      id: 1,
      name: 'Ahamed Rizwan',
      medhiveId: 'MH1001',
      date: '2026-03-10',
      time: '10:30 AM',
    },
    {
      id: 2,
      name: 'Fathima Naleem',
      medhiveId: 'MH1002',
      date: '2026-03-12',
      time: '02:15 PM',
    },
    {
      id: 3,
      name: 'Mohamed Ijaz',
      medhiveId: 'MH1003',
      date: '2026-03-15',
      time: '11:45 AM',
    },
    {
      id: 4,
      name: 'Sara Shafra',
      medhiveId: 'MH1004',
      date: '2026-03-18',
      time: '09:20 AM',
    },
  ];

  // Filter by patient ID
  const filteredPatients = patientHistory.filter((patient) =>
    patient.medhiveId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="history-page">
      <header className="history-header">
        <h1>Patient Visit History</h1>
 
        <div className="history-search-wrapper">
          <input
            type="text"
            placeholder="Enter patient ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="history-search-input"
          />
        </div>
      </header>

      <div className="history-list">
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => (
            <div className="history-card" key={patient.id}>
              <h3>{patient.name}</h3>
              <p><strong>MedHive ID:</strong> {patient.medhiveId}</p>
              <p><strong>Date:</strong> {patient.date}</p>
              <p><strong>Time:</strong> {patient.time}</p>
            </div>
          ))
        ) : (
          <p className="no-results">No patient history found.</p>
        )}
      </div>

      {/* 🔹 Bottom Back Button */}
      <div className="history-bottom">
        <button
          className="back-btn"
          onClick={() => navigate('/search')}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default PatientHistory;