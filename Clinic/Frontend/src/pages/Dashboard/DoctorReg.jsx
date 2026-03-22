import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/Search.css';
import PatientProfile from './PatientProfile';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  // UPDATED: Now holds an array of results instead of just one
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null); // The patient clicked for OTP
 
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [accessGranted, setAccessGranted] = useState(false);
  const [fullPatientData, setFullPatientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const navigate = useNavigate();
  // UPDATED: Fixed port to 5000 to match your backend
  const API_URL = 'http://localhost:5000/api/patients';

  const handleLogout = () => {
    localStorage.removeItem('doctor');
    localStorage.removeItem('token'); // Clear token on logout
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
    setSearchResults([]);
    setSelectedPatient(null);
    setAccessGranted(false);

    try {
      const res = await axios.get(`${API_URL}/search`, {
        params: { query: searchQuery }
      });

      if (res.data && res.data.length > 0) {
        setSearchResults(res.data); // Store all matches
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

  const openModalForPatient = (patient) => {
    setSelectedPatient(patient);
    setShowRequestModal(true);
  };

  const handleRequestAccess = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/request-access`, {
        med_id: selectedPatient.med_id
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
      // UPDATED: Grab the doctor's token to send to the backend for history tracking
      const token = localStorage.getItem("token");

      const res = await axios.post(`${API_URL}/verify-otp`,
        {
          med_id: selectedPatient.med_id,
          otp
        },
        {
          headers: { Authorization: `Bearer ${token}` } // Passes the auth requirement
        }
      );

      setFullPatientData(res.data);
      setAccessGranted(true);
      setShowRequestModal(false);
      setOtpSent(false);
      setOtp('');
      setSearchResults([]); // Clear search list once a profile is open
    } catch (err) {
      alert('Invalid code or session expired.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">

      {/* HEADER */}
      <header className="search-header">
        <h1>Patient Search</h1>

        <form onSubmit={handleSearch} className="search-bar-wrapper">
          <input
            type="text"
            placeholder="Search by Patient ID or Name"
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

      {/* RESULTS */}
      <div className="search-results-area">
        {searchResults.length > 0 && !accessGranted && (
          <div className="results-list">
            {searchResults.map((patient) => (
              <motion.div
                key={patient.med_id}
                className="patient-preview-bar"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => openModalForPatient(patient)}
                style={{ marginBottom: '10px', cursor: 'pointer' }}
              >
                <div className="avatar-placeholder">
                  {patient.fname?.[0] || ''}{patient.lname?.[0] || ''}
                </div>

                <div className="preview-info">
                  <h3>{patient.fname} {patient.lname}</h3>
                  <p>ID: {patient.med_id} | Gender: {patient.gender}</p>
                </div>

                <span className="view-tag">Click to Request Access</span>
              </motion.div>
            ))}
          </div>
        )}

        {accessGranted && fullPatientData && <PatientProfile data={fullPatientData} />}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {showRequestModal && selectedPatient && (
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
              <p>Requesting to view records for {selectedPatient.fname}.</p>
                  <button onClick={handleRequestAccess} disabled={loading}>
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                  <button onClick={() => setShowRequestModal(false)}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h2>Enter OTP</h2>
                  <p>Enter the 2-digit code sent to the patient.</p>
                  <input
                    type="text"
                    maxLength="2"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="00"
                  />
                  <button onClick={handleVerifyOTP} disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify'}
                  </button>
                  <button onClick={() => {
                    setShowRequestModal(false);
                    setOtpSent(false);
                    setOtp('');
                  }}>
                    Cancel
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isSearchFocused && !accessGranted && (
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
    </div>
  );
};

export default SearchPage;