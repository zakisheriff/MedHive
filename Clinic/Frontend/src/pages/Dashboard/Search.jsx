import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import './css/Search.css';
import PatientProfile from './PatientProfile';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [patientPreview, setPatientPreview] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [accessGranted, setAccessGranted] = useState(false);
  const [fullPatientData, setFullPatientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:5002/api/patients';

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError('');
    setPatientPreview(null);
    setAccessGranted(false);

    try {
      const res = await axios.get(`${API_URL}/search`, {
        params: { query: searchQuery }
      });
      if (res.data && res.data.length > 0) {
        setPatientPreview(res.data[0]);
      } else {
        setError('No patient found with that ID or name.');
      }
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAccess = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/request-access`, { med_id: patientPreview.med_id });
      setOtpSent(true);
    } catch (err) {
      alert("Failed to request access. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 2) {
      alert("Please enter the 2-digit code provided by the patient.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/verify-otp`, { 
        med_id: patientPreview.med_id, 
        otp 
      });
      setFullPatientData(res.data);
      setAccessGranted(true);
      setShowRequestModal(false);
      setOtpSent(false);
      setOtp('');
    } catch (err) {
      alert(err.response?.data?.error || "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <header className="search-header">
        <h1>Patient Search</h1>
        <form onSubmit={handleSearch} className="search-bar-wrapper">
          <input 
            type="text" 
            placeholder="Search by Patient ID (e.g., 2026...)" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
        {error && <p className="search-error">{error}</p>}
      </header>

      <div className="search-results-area">
        {/* STAGE 1: The Preview Bar */}
        {patientPreview && !accessGranted && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
            className="patient-preview-bar" onClick={() => setShowRequestModal(true)}>
            <div className="avatar-placeholder">
              {patientPreview.fname[0]}{patientPreview.lname[0]}
            </div>
            <div className="preview-info">
              <h3>{patientPreview.fname} {patientPreview.lname}</h3>
              <p>ID: {patientPreview.med_id}</p>
            </div>
            <span className="view-tag">Click to Request View Access</span>
          </motion.div>
        )}

        {/* STAGE 2: The Medical Profile (Only if granted) */}
        {accessGranted && <PatientProfile data={fullPatientData} />}
      </div>

      {/* REQUEST & VERIFY MODAL */}
      <AnimatePresence>
        {showRequestModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="request-modal">
              {!otpSent ? (
                <>
                  <h2>Request View Access?</h2>
                  <p>You are requesting to view the medical history of <strong>{patientPreview.fname} {patientPreview.lname}</strong>. A 2-digit access code will be generated for the patient.</p>
                  <div className="modal-actions">
                    <button className="cancel-btn" onClick={() => setShowRequestModal(false)}>Cancel</button>
                    <button className="confirm-btn" onClick={handleRequestAccess} disabled={loading}>
                      {loading ? 'Requesting...' : 'Generate Code'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2>Enter Access Code</h2>
                  <p>A 2-digit code has been generated. Please ask <strong>{patientPreview.fname}</strong> for the code shown on their app.</p>
                  
                  <div className="otp-input-group">
                    <input 
                      id="otp-0"
                      type="text" 
                      maxLength="1" 
                      placeholder="0" 
                      value={otp[0] || ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        const newOtp = val + (otp[1] || '');
                        setOtp(newOtp.slice(0, 2));
                        if (val) document.getElementById('otp-1')?.focus();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleVerifyOTP();
                        if (e.key === 'Backspace' && !otp[0]) {
                          // Already empty, nothing to do
                        }
                      }}
                      className="otp-box"
                      autoFocus
                    />
                    <input 
                      id="otp-1"
                      type="text" 
                      maxLength="1" 
                      placeholder="0" 
                      value={otp[1] || ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        const newOtp = (otp[0] || '') + val;
                        setOtp(newOtp.slice(0, 2));
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleVerifyOTP();
                        if (e.key === 'Backspace' && !otp[1]) {
                          document.getElementById('otp-0')?.focus();
                        }
                      }}
                      className="otp-box"
                    />
                  </div>

                  <div className="modal-actions">
                    <button className="cancel-btn" onClick={() => { setShowRequestModal(false); setOtpSent(false); }}>Cancel</button>
                    <button className="confirm-btn" onClick={handleVerifyOTP} disabled={loading}>
                      {loading ? 'Verifying...' : 'Verify & View'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchPage;