import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  // Prescription Images - Replace these paths with your actual image files
  const prescriptions = [
    { id: 1, src: '/pres-1.png', rotate: -15, x: -50, y: 0 },
    { id: 2, src: '/pres-2.png', rotate: -5, x: 20, y: -40 },
    { id: 3, src: '/pres-3.png', rotate: 10, x: 80, y: -80 }
  ];

  return (
    <div className="auth-page">
      {/* LEFT SIDE: Animation */}
      <div className="animation-section">
        <div className="orange-container">
          <div className="welcome-header">
            <span className="welcome-text">Welcome to</span>
            <img src="/logo.png" alt="MedHive Logo" style={{ height: '50px' }} />
          </div>
          <h2 className="dashboard-subtext">Dashboard</h2>

          <div className="prescription-stack">
            {prescriptions.map((pres, index) => (
              <motion.img
                key={pres.id}
                src={pres.src}
                className="prescription-card"
                initial={{ y: 800, opacity: 0, rotate: 0 }}
                animate={{ 
                  y: pres.y, 
                  opacity: 1, 
                  rotate: pres.rotate,
                  x: pres.x 
                }}
                transition={{ 
                  duration: 1.2, 
                  delay: 0.5 + (index * 0.3), // Staggered entry
                 
                }}
                
              />
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="form-section">
        <div className="login-card">
          <h1 style={{ marginBottom: '30px', fontWeight: 'bold' }}>Clinic Login</h1>
          <form>
            <input type="email" placeholder="Clinic Email" required />
            <input type="password" placeholder="Password" required />
            <button className="btn-primary">Sign In</button>
          </form>
          <p style={{ marginTop: '20px', fontSize: '14px' }}>
            New clinic? <Link to="/signup" style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>Request Access</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;