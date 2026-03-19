import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/DoctorLogin.css";

const DoctorLogin = () => {
  const [formData, setFormData] = useState({
    nic: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const storedDoctor = JSON.parse(localStorage.getItem("doctor"));

  
    if (!storedDoctor) {
      alert("You are not registered. Please register first.");
      navigate("/doctor-register");
      return;
    }

   
    if (
      storedDoctor.nic !== formData.nic ||
      storedDoctor.password !== formData.password
    ) {
      setError("Invalid NIC or password");
      return;
    }

 
    alert(`Welcome Dr. ${storedDoctor.doctorName}`);
    navigate("/search"); // go to search page
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

          <button type="submit" className="login-btn">
            Login
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