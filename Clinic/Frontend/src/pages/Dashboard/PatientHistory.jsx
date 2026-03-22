import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/PatientHistory.css';

const PatientHistory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:5002/api/doctors/history';

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('doctorToken');

        if (!token) {
          setError('You are not logged in.');
          setLoading(false);
          return;
        }

        const res = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setHistoryData(res.data.history || []);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || 'Failed to fetch history.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Filter by Med ID
  const filteredPatients = historyData.filter((patient) =>
    String(patient.med_id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString();
  };

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

      {loading && <p>Loading history...</p>}
      {error && <p className="no-results">{error}</p>}

      <div className="history-list">
        {!loading && !error && filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => (
            <div className="history-card" key={patient.visit_id || patient.id}>
              <h3>
                {patient.fname} {patient.lname}
              </h3>

              <p>
                <strong>MedHive ID:</strong> {patient.med_id}
              </p>

              <p>
                <strong>Date:</strong> {formatDate(patient.visited_at)}
              </p>

              <p>
                <strong>Time:</strong> {formatTime(patient.visited_at)}
              </p>
            </div>
          ))
        ) : (
          !loading &&
          !error && <p className="no-results">No patient history found.</p>
        )}
      </div>

      <div className="history-bottom">
        <button className="back-btn" onClick={() => navigate('/search')}>
          Back
        </button>
      </div>
    </div>
  );
};

export default PatientHistory;