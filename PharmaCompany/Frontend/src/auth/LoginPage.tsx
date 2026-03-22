import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SplashScreen } from './SplashScreen';
import styles from './Login.module.css';
import medHiveLogo from '../assets/images/MedHive pharma logo.png-.png';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Clear previous errors

    try {
      // 1. Direct POST request to your Node.js backend
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      // 2. If successful, log the data and save to localStorage
      console.log("Login Success:", response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // 3. Show the splash screen before entering the app
      setShowSplash(true);

    } catch (err: any) {
      // 4. Handle specific errors from your backend (e.g., 401 Unauthorized)
      const backendError = err.response?.data?.error || "Connection failed. Is the server running?";
      setError(backendError);
    } finally {
      setLoading(false);
    }
  };

  // If login was successful, show the Splash Screen
  if (showSplash) return <SplashScreen />;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <img src={medHiveLogo} alt="MedHive Pharma" />
          </div>
        </div>

        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@company.com"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? <span className={styles.loadingSpinner}></span> : 'Log In'}
          </button>
        </form>

        <div className={styles.footer}>
          Don't have an account?{' '}
          <span className={styles.link} onClick={() => navigate('/register')}>
            Register Now
          </span>
        </div>
      </div>
    </div>
  );
};