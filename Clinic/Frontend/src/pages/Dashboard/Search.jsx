import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const navigate = useNavigate();
  const API_URL = 'http://localhost:5002/api/patients';

  const handleLogout = () => {
    localStorage.removeItem('doctor');
    navigate('/role-select');
  };

  const handleGoToHistory = () => {
    navigate('/patient-history');
  };

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
      await axios.post(`${API_URL}/request-access`, {
        med_id: patientPreview.med_id
      });
      setOtpSent(true);
    } catch (err) {
      alert('Failed to request access.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 2) {
      alert('Enter 2-digit code');
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
      alert('Invalid code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">

      {/* 🔹 HEADER */}
      <header className="search-header">
        <h1>Patient Search</h1>

        <form onSubmit={handleSearch} className="search-bar-wrapper">
          <input
            type="text"
            placeholder="Search by Patient ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && <p className="search-error">{error}</p>}
      </header>

      {/* 🔹 RESULTS */}
      <div className="search-results-area">
        {patientPreview && !accessGranted && (
          <motion.div
            className="patient-preview-bar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowRequestModal(true)}
          >
            <div className="avatar-placeholder">
              {patientPreview.fname[0]}{patientPreview.lname[0]}
            </div>

            <div className="preview-info">
              <h3>{patientPreview.fname} {patientPreview.lname}</h3>
              <p>ID: {patientPreview.med_id}</p>
            </div>

            <span className="view-tag">Click to Request Access</span>
          </motion.div>
        )}

        {accessGranted && <PatientProfile data={fullPatientData} />}
      </div>

      {/* 🔹 MODAL */}
      <AnimatePresence>
        {showRequestModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="request-modal">
              {!otpSent ? (
                <>
                  <h2>Request Access?</h2>

                  <div className="modal-actions">
                    <button
                      className="cancel-btn"
                      onClick={() => setShowRequestModal(false)}
                    >
                      Cancel
                    </button>

                    <button
                      className="confirm-btn"
                      onClick={handleRequestAccess}
                    >
                      Generate Code
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2>Enter Code</h2>

                  <div className="otp-input-group">
                    <input
                      maxLength="1"
                      value={otp[0] || ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setOtp(val + (otp[1] || ''));
                      }}
                      className="otp-box"
                    />

                    <input
                      maxLength="1"
                      value={otp[1] || ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setOtp((otp[0] || '') + val);
                      }}
                      className="otp-box"
                    />
                  </div>

                  <div className="modal-actions">
                    <button
                      className="cancel-btn"
                      onClick={() => setShowRequestModal(false)}
                    >
                      Cancel
                    </button>

                    <button
                      className="confirm-btn"
                      onClick={handleVerifyOTP}
                    >
                      Verify
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔥 ANIMATED BOTTOM BUTTONS */}
      <AnimatePresence>
        {!isSearchFocused && (
          <motion.div
            className="bottom-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <button className="history-btn" onClick={handleGoToHistory}>
              History
            </button>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default SearchPage;