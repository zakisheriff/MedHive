import React, { useState } from 'react';
import './Auth.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  // New constants for your two separate files
  const leftImage = "/medhive-slide-login.png"; 
  const rightImage = "/medhive-slide-register.png"; 
  const logo = "/MedHiveLogo.png"; 

  return (
    <div className="auth-container">
      {/* Branding Header stays fixed */}
      <div className="branding">
        <img src={logo} alt="Logo" className="logo-icon" />
        <div className="branding-text">
          <span>MedHive</span> Dashboard
        </div>
      </div>

      <div className={`auth-slider ${!isLogin ? 'show-signup' : ''}`}>
        
        {/* SCENE 1: LOGIN (Details Left, Left Image Right) */}
        <div className="auth-section">
          <div className="form-half">
            <div className="auth-form-box">
              <h2>Login</h2>
              <p>Please login to continue to your account.</p>
              <form>
                <input type="email" placeholder="Clinic Email" required />
                <input type="password" placeholder="Password" required />
                <button type="submit" className="btn-main">Login</button>
              </form>
              <div className="toggle-text">
                Don't have an account?{' '}
                <span className="toggle-link" onClick={() => setIsLogin(false)}>Register</span>
              </div>
            </div>
          </div>
          <div 
            className="image-half login-image-half" 
            style={{ backgroundImage: `url("${leftImage}")` }}
          />
        </div>

        {/* SCENE 2: SIGNUP (Right Image Left, Details Right) */}
        <div className="auth-section">
          <div 
            className="image-half signup-image-half" 
            style={{ backgroundImage: `url("${rightImage}")` }}
          />
          <div className="form-half">
            <div className="auth-form-box">
              <h2>Sign up</h2>
              <p>Register your clinic to get started.</p>
              <form>
                <input type="text" placeholder="Clinic Name" required />
                <input type="text" placeholder="Registration No" required />
                <input type="email" placeholder="Email Address" required />
                <input type="password" placeholder="Password" required />
                <button type="submit" className="btn-main">Sign up</button>
              </form>
              <div className="toggle-text">
                Already have an account?{' '}
                <span className="toggle-link" onClick={() => setIsLogin(true)}>Login</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;