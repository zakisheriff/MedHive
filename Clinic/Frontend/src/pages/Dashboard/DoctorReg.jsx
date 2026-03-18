import React, { useState } from "react";
import "./css/DoctorReg.css";
import { useNavigate } from "react-router-dom";

const DoctorRegister = () => {
  const [formData, setFormData] = useState({
    doctorName: "",
    nic: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

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
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setSuccessMessage("");
      return;
    }

    console.log("Doctor Registration Data:", formData);

    setSuccessMessage("Doctor registered successfully!");

    setFormData({
      doctorName: "",
      nic: "",
      password: "",
      confirmPassword: "",
    });

    setErrors({});

    setTimeout(() => {
      navigate("/search");
    }, 1000);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Doctor Registration</h2>
        <p className="subtitle">
          Register to access your patients' health records securely.
        </p>

        <div className="info-box">
          <strong>Important:</strong> A doctor should only be able to access
          health records of patients who have consulted that doctor.
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
            {errors.doctorName && (
              <span className="error">{errors.doctorName}</span>
            )}
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
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}
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

          <button type="submit" className="register-btn">
            Register
          </button>
        </form>

        {successMessage && <p className="success">{successMessage}</p>}
      </div>
    </div>
  );
};

export default DoctorRegister;