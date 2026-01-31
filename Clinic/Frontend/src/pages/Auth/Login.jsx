import React from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src="/MedHive text-1.png" alt="MedHive Logo" className="auth-logo" />
        
        <div className="auth-header">
          <h1>Clinic Login</h1>
          <p>Welcome back. Please enter your details.</p>
        </div>

        <form>
          <div className="form-group">
            <label>Clinic Email</label>
            <input type="email" placeholder="email@clinic.com" className="auth-input" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" className="auth-input" required />
          </div>

          <button type="submit" className="btn-submit">Login</button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/signup" className="auth-link">Register your clinic</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;