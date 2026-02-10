import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:5000";

const PendingVerification = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState("");

  const handleRefresh = async () => {
    setChecking(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/api/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.clinic.verification_status === "APPROVED") {
        localStorage.setItem("clinic", JSON.stringify(res.data.clinic));
        navigate("/dashboard/home");
      } else {
        setMessage("Your account is still pending approval. Please check back later.");
      }
    } catch (err) {
      // If the backend returns 403 because it's still PENDING
      setMessage("Account still pending. We'll email you once it's approved!");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="auth-container" style={{ textAlign: "center", paddingTop: "80px" }}>
       <div className="auth-form-box" style={{ maxWidth: "500px", margin: "0 auto" }}>
          <h2>Verification in Progress</h2>
          <p>We have received your PHSRC certificate. Our team is currently reviewing your details.</p>
          
          {message && <p style={{ color: "#2c3e50", fontWeight: "bold" }}>{message}</p>}

          <button 
            className="btn-main" 
            onClick={handleRefresh} 
            disabled={checking}
            style={{ marginTop: "20px" }}
          >
            {checking ? "Checking..." : "I've been approved, let me in"}
          </button>
       </div>
    </div>
  );
};

export default PendingVerification;