import React from 'react';
import './Auth.css';

const Signup = () => {
  return (
    <div className="auth-page">
      <div className="glass-card">
        <h2 className="golden-text">Clinic Registration</h2>
        <form>
          <input type="text" placeholder="Clinic Name" required />
          <input type="text" placeholder="PHSRC Number" required />
          <input type="email" placeholder="Official Email" required />
          <input type="password" placeholder="Create Password" required />
          <div style={{ marginBottom: '20px' }}>
             <label style={{ fontSize: '12px', display: 'block', marginBottom: '5px' }}>Upload PHSRC Certificate</label>
             <input type="file" required style={{ fontSize: '12px' }} />
          </div>
          <button type="submit" className="btn-primary">Apply for Access</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;