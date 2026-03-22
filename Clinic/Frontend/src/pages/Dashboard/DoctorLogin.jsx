import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/DoctorLogin.css";
import axios from "axios";

const DoctorLogin = () => {
  const [formData, setFormData] = useState({
    nic: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const API_URL = "http://localhost:5002/api/doctors/login";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.nic || !formData.password) {
      setError("NIC and password are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(API_URL, {
        nic: formData.nic,
        password: formData.password,
      });

      // store token + doctor data
      localStorage.setItem("doctorToken", res.data.token);
      localStorage.setItem("doctorData", JSON.stringify(res.data.doctor));

      navigate("/search");
    } catch (error) {
      console.error(error);

      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("Login failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Doctor Login</h2>
        <p className="subtitle">Login to access your patients</p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>NIC Number</label>
            <input
              type="text"
              name="nic"
              placeholder="Enter NIC"
              value={formData.nic}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="register-link">
          Not registered?{" "}
          <span onClick={() => navigate("/doctor-register")}>
            Register here
          </span>
        </p>
      </div>
    </div>
  );
};

export default DoctorLogin;