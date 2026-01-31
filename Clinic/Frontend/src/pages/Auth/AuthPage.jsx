import React, { useState } from 'react';
import './Auth.css';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    console.log("Authenticating...");

    navigate('/dashboard/home'); 
  };

  const leftImage = "/medhive-slide-login.png"; 
  const rightImage = "/medhive-slide-register.png"; 
  
  // Define separate logo paths for each screen
  const loginLogo = "/Medhive-dashboard.png"; 
  const registerLogo = "/Medhive-dashboard.png"; 

  return (
    <div className="auth-container">
      <div className={`auth-slider ${!isLogin ? 'show-signup' : ''}`}>
        
        {/* SCENE 1: LOGIN (Details Left, Image Right) */}
        <div className="auth-section">
          <div className="form-half">
            <div className="auth-content-wrapper">
              <img src={loginLogo} alt="Login Logo" className="form-logo" />
              <div className="auth-form-box">
                <h2>Login</h2>
                <p>Please login to continue to your account.</p>
                <form onSubmit={handleAuthSubmit}>
                  <input type="email" placeholder="Clinic Email" required className="auth-input" />
                  <input type="password" placeholder="Password" required className="auth-input" />
                  <button type="submit" className="btn-main">Login</button>
                </form>
                <div className="toggle-text">
                  Don't have an account?{' '}
                  <span className="toggle-link" onClick={() => setIsLogin(false)}>Register</span>
                </div>
              </div>
            </div>
          </div>
          <div 
            className="image-half" 
            style={{ backgroundImage: `url("${leftImage}")` }}
          />
        </div>

        {/* SCENE 2: SIGNUP (Image Left, Details Right) */}
        <div className="auth-section">
          <div 
            className="image-half" 
            style={{ backgroundImage: `url("${rightImage}")` }}
          />
          <div className="form-half">
            <div className="auth-content-wrapper">
              <img src={registerLogo} alt="Register Logo" className="form-logo" />
              <div className="auth-form-box">
                <h2>Sign up</h2>
                <p>Register your clinic to get started.</p>
                <form onSubmit={handleAuthSubmit}>
                  <input type="text" placeholder="Clinic Name" required className="auth-input" />
                  <input type="text" placeholder="Registration No" required className="auth-input" />
                  <input type="email" placeholder="Email Address" required className="auth-input" />
                  <input type="password" placeholder="Password" required className="auth-input" />
                  
                  <div className="file-upload-group">
                    <label htmlFor="certificate">Upload PHSRC Certificate (PDF/Image)</label>
                    <input 
                    type="file" 
                    id="certificate" 
                    accept=".pdf, image/*" 
                    required 
                    className="auth-input file-input" 
                    />
                </div>
                
                  <button type="submit" className="btn-main" onClick={home} >Sign up</button>
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
    </div>
  );
};

export default AuthPage;