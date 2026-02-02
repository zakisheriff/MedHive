import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './css/Search.css';
import PatientProfile from './PatientProfile'; // We will create this next

const SearchPage = () => {
  const [searchId, setSearchId] = useState('');
  const [patientPreview, setPatientPreview] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

  // Simulated User Data
  const mockPatients = {
    "mh001": { id: "mh001", name: "Abdul Raheem", profilePic: "/icons/male.jpg" }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const patient = mockPatients[searchId.toLowerCase()];
    setPatientPreview(patient || null);
  };

  const handleRequestAccess = () => {
    // In future, this calls the backend to send a notification to the mobile app
    setShowRequestModal(false);
    alert("Request sent to patient's mobile app.");
    
    // Simulating user granting access after 2 seconds for demo purposes
    setTimeout(() => {
      setAccessGranted(true);
    }, 2000);
  };

  return (
    <div className="search-container">
      <header className="search-header">
        <h1>Patient Search</h1>
        <form onSubmit={handleSearch} className="search-bar-wrapper">
          <input 
            type="text" 
            placeholder="Search by Patient ID (e.g., mh001)" 
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button type="submit" className="search-btn">Search</button>
        </form>
      </header>

      <div className="search-results-area">
        {/* STAGE 1: The Preview Bar */}
        {patientPreview && !accessGranted && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
            className="patient-preview-bar" onClick={() => setShowRequestModal(true)}>
            <img src={patientPreview.profilePic} alt="avatar" />
            <div className="preview-info">
              <h3>{patientPreview.name}</h3>
              <p>{patientPreview.id}</p>
            </div>
            <span className="view-tag">Click to Request View Access</span>
          </motion.div>
        )}

        {/* STAGE 2: The Medical Profile (Only if granted) */}
        {accessGranted && <PatientProfile patientId={searchId} />}
      </div>

      {/* REQUEST MODAL */}
      <AnimatePresence>
        {showRequestModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="request-modal">
              <h2>Request View Access?</h2>
              <p>You are requesting to view the medical history of <strong>{patientPreview.name}</strong>. A notification will be sent to their app.</p>
              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setShowRequestModal(false)}>Cancel</button>
                <button className="confirm-btn" onClick={handleRequestAccess}>Request Access</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchPage;