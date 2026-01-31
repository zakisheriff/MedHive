import React from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const Signup = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src="/MedHive text-1.png" alt="MedHive Logo" className="auth-logo" />
        
        <div className="auth-header">
          <h1>Clinic Registration</h1>
          <p>Apply for institutional access to MedHive.</p>
        </div>

        <form>
          <div className="form-group">
            <label>Clinic Name</label>
            <input type="text" placeholder="e.g., City Medical Center" className="auth-input" required />
          </div>

          <div className="form-group">
            <label>PHSRC Number</label>
            <input type="text" placeholder="Official Registration No" className="auth-input" required />
          </div>

          <div className="form-group">
            <label>Official Email</label>
            <input type="email" placeholder="admin@clinic.com" className="auth-input" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Create a secure password" className="auth-input" required />
          </div>

          <div className="form-group">
            <label>PHSRC Certificate (Image/PDF)</label>
            <input type="file" className="auth-input" style={{ padding: '10px' }} required />
          </div>

          <button type="submit" className="btn-submit">Apply for Access</button>
        </form>

        <div className="auth-footer">
          Already registered? <Link to="/" className="auth-link">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;