import React from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  return (
    <div className="auth-page">
      <div className="glass-card">
        <h2 className="golden-text">Clinic Portal</h2>
        <form>
          <input type="email" placeholder="Clinic Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit" className="btn-primary">Sign In</button>
        </form>
        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          New clinic? <Link to="/signup" style={{ color: 'var(--accent-gold)' }}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;