import React, { useState } from "react";
import "./Auth.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:5000";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register state
  const [clinicName, setClinicName] = useState("");
  const [registrationNo, setRegistrationNo] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [certificateFile, setCertificateFile] = useState(null);

  // Register password validation UI
  const [passwordError, setPasswordError] = useState("");

  const leftImage = "/medhive-slide-login.png";
  const rightImage = "/medhive-slide-register.png";
  const loginLogo = "/Medhive-dashboard.png";
  const registerLogo = "/Medhive-dashboard.png";

  const validatePassword = (value) => {
    if (value.length < 8) return "Password must be at least 8 characters";
    if (value.length > 72) return "Password must be less than 72 characters";
    return "";
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Block signup if password invalid
    if (!isLogin) {
      const err = validatePassword(registerPassword);
      setPasswordError(err);
      if (err) return;
    }

    setLoading(true);

    try {
      let res;
      if (isLogin) {
        res = await axios.post(
          `${API_BASE}/api/auth/login`,
          { email: loginEmail, password: loginPassword },
          { headers: { "Content-Type": "application/json" } }
        );
      } else {
        const formData = new FormData();
        formData.append("clinicName", clinicName);
        formData.append("registrationNo", registrationNo);
        formData.append("email", registerEmail);
        formData.append("password", registerPassword);
        if (certificateFile) formData.append("certificate", certificateFile);

        res = await axios.post(`${API_BASE}/api/auth/register`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // 1. Store the basics
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("clinic", JSON.stringify(res.data.clinic));

      // 2. Routing Logic based on verification_status
      if (res.data.clinic.verification_status === "APPROVED") {
        navigate("/dashboard/home");
      } else {
        // This covers both "PENDING" and any other non-approved state
        navigate("/pending-verification"); 
      }

    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        (Array.isArray(err?.response?.data?.details)
          ? err.response.data.details.map((d) => d.message).join(", ")
          : null) ||
        err?.message ||
        "Something went wrong";

      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const switchToRegister = () => {
    setIsLogin(false);
    setErrorMsg("");
    setPasswordError("");
  };

  const switchToLogin = () => {
    setIsLogin(true);
    setErrorMsg("");
    setPasswordError("");
  };

  return (
    <div className="auth-container">
      <div className={`auth-slider ${!isLogin ? "show-signup" : ""}`}>
        {/* SCENE 1: LOGIN */}
        <div className="auth-section">
          <div className="form-half">
            <div className="auth-content-wrapper">
              <img src={loginLogo} alt="Login Logo" className="form-logo" />

              <div className="auth-form-box">
                <h2>Login</h2>
                <p>Please login to continue to your account.</p>

                {errorMsg && isLogin && (
                  <div style={{ marginBottom: 10, color: "crimson" }}>
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleAuthSubmit}>
                  <input
                    name="email"
                    type="email"
                    placeholder="Clinic Email"
                    required
                    className="auth-input"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    disabled={loading}
                  />

                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    className="auth-input"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    disabled={loading}
                  />

                  <button type="submit" className="btn-main" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </form>

                <div className="toggle-text">
                  Don't have an account?{" "}
                  <span className="toggle-link" onClick={switchToRegister}>
                    Register
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="image-half"
            style={{ backgroundImage: `url("${leftImage}")` }}
          />
        </div>

        {/* SCENE 2: SIGNUP */}
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

                {errorMsg && !isLogin && (
                  <div style={{ marginBottom: 10, color: "crimson" }}>
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleAuthSubmit}>
                  <input
                    name="clinicName"
                    type="text"
                    placeholder="Clinic Name"
                    className="auth-input"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    disabled={loading}
                    required
                  />

                  <input
                    name="registrationNo"
                    type="text"
                    placeholder="Registration No"
                    className="auth-input"
                    value={registrationNo}
                    onChange={(e) => setRegistrationNo(e.target.value)}
                    disabled={loading}
                    required
                  />

                  <input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    className="auth-input"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    disabled={loading}
                    required
                  />

                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className={`auth-input ${passwordError ? "input-error" : ""}`}
                    value={registerPassword}
                    onChange={(e) => {
                      const val = e.target.value;
                      setRegisterPassword(val);
                      setPasswordError(validatePassword(val));
                    }}
                    onBlur={() => setPasswordError(validatePassword(registerPassword))}
                    disabled={loading}
                    required
                  />

                  {passwordError && (
                    <p className="error-text">{passwordError}</p>
                  )}

                  <div className="file-upload-group">
                    <label htmlFor="certificate">
                      Upload PHSRC Certificate (PDF/Image)
                    </label>
                    <input
                      name="certificate"
                      type="file"
                      id="certificate"
                      accept=".pdf, image/*"
                      className="auth-input file-input"
                      onChange={(e) =>
                        setCertificateFile(e.target.files?.[0] || null)
                      }
                      disabled={loading}
                    />
                  </div>

                  <button type="submit" className="btn-main" disabled={loading}>
                    {loading ? "Signing up..." : "Sign up"}
                  </button>
                </form>

                <div className="toggle-text">
                  Already have an account?{" "}
                  <span className="toggle-link" onClick={switchToLogin}>
                    Login
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* end slider */}
      </div>
    </div>
  );
};

export default AuthPage;
