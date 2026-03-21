import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.module.css'; // Using your existing styles
import medHiveLogo from '../assets/images/MedHive pharma logo.png-.png';

export const PendingVerification = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState("");

  const handleRefresh = async () => {
    setChecking(true);
    setMessage("");
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Please log in to check your status.");
        setChecking(false);
        return;
      }

      // We hit a "me" endpoint to get the latest status from the DB
      const res = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.user.verification_status === "APPROVED") {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/dashboard"); // Redirect to your pharma dashboard
      } else {
        setMessage("Your account is still pending approval. Our team is reviewing your NMRA certificate.");
      }
    } catch (err: any) {
      // If the token is invalid or server is down
      setMessage("Verification still in progress. We'll update you soon!");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card} style={{ textAlign: 'center', maxWidth: '500px' }}>
        <div className={styles.header}>
          <img src={medHiveLogo} className={styles.logo} alt="MedHive Logo" />
          <h2 className={styles.title}>Verification in Progress</h2>
          <p className={styles.subtitle}>
            We have received your <strong>NMRA certificate</strong>. 
            Our compliance team is currently reviewing your details.
          </p>
        </div>

        <div className={styles.form}>
          <div className={styles.infoBox} style={{ 
            background: '#f8f9fa', 
            padding: '1.5rem', 
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            color: '#555'
          }}>
            {message ? (
              <p style={{ color: '#d35400', fontWeight: 'bold' }}>{message}</p>
            ) : (
              <p>Review typically takes 24-48 business hours.</p>
            )}
          </div>

          <button
            className={styles.button}
            onClick={handleRefresh}
            disabled={checking}
          >
            {checking ? "Checking System..." : "Check Approval Status"}
          </button>

          <button 
            type="button" 
            className={styles.backButton} 
            onClick={() => navigate('/login')}
            style={{ marginTop: '1rem', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};