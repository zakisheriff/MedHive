import React, { useState } from "react";
import "./css/DoctorReg.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DoctorRegister = () => {
  const [formData, setFormData] = useState({
    doctorName: "",
    nic: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const API_URL = "http://localhost:5002/api/doctors/register";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.doctorName.trim()) {
      newErrors.doctorName = "Doctor name is required";
    }

    if (!formData.nic.trim()) {
      newErrors.nic = "NIC number is required";
    } else if (!/^([0-9]{9}[vVxX]|[0-9]{12})$/.test(formData.nic)) {
      newErrors.nic = "Enter a valid NIC number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  // 🔥 FINAL SUBMIT FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setSuccessMessage("");
      return;
    }

    setLoading(true);

    try {
      // ✅ IMPORTANT CHANGE (matches backend exactly)
      const res = await axios.post(API_URL, {
        doctorName: formData.doctorName,
        nic: formData.nic,
        password: formData.password,
      });

      console.log("Saved to DB:", res.data);

      setSuccessMessage("Doctor registered successfully!");

      setFormData({
        doctorName: "",
        nic: "",
        password: "",
        confirmPassword: "",
      });

      setErrors({});

      setTimeout(() => {
        navigate("/doctor-login");
      }, 1000);

    } catch (error) {
      console.error(error);

      if (error.response?.data?.error) {
        setErrors({ nic: error.response.data.error });
      } else {
        setErrors({ general: "Registration failed. Try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Doctor Registration</h2>

        <p className="subtitle">
          Register to access your patients' health records securely.
        </p>

        <div className="info-box">
          <strong>Important:</strong> A doctor should only access patients who consulted them.
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Doctor Name</label>
            <input
              type="text"
              name="doctorName"
              placeholder="Enter doctor name"
              value={formData.doctorName}
              onChange={handleChange}
            />
            {errors.doctorName && <span className="error">{errors.doctorName}</span>}
          </div>

          <div className="form-group">
            <label>NIC Number</label>
            <input
              type="text"
              name="nic"
              placeholder="Enter NIC number"
              value={formData.nic}
              onChange={handleChange}
            />
            {errors.nic && <span className="error">{errors.nic}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Set password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <span className="error">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {errors.general && <p className="error">{errors.general}</p>}

        <p className="register-link">
          Already registered?{" "}
          <span onClick={() => navigate("/doctor-login")}>
            Login here
          </span>
        </p>

        {successMessage && <p className="success">{successMessage}</p>}
      </div>
    </div>
  );
};

export default DoctorRegister;