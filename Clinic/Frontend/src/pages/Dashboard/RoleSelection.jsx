import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/RoleSelection.css";


const RoleSelect = () => {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    if (role === "doctor") {
      navigate("/doctor-login");
    } else if (role === "admin") {
      navigate("/admin-register");
    }
  };

  return (
    <div className="role-container">
      <div className="role-card">
        <h2>Welcome</h2>
        <p>Select how you want to continue</p>

        <div className="button-group">
          <button
            className="role-btn doctor"
            onClick={() => handleSelect("doctor")}
          >
            Doctor
          </button>

          <button
            className="role-btn admin"
            onClick={() => handleSelect("admin")}
          >
             Clinic Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelect;