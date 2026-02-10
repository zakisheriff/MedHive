import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const API_BASE = "http://localhost:5000";

const AdminDashboard = () => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/admin/pending-clinics`);
        setPending(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm("Are you sure you want to approve this clinic?")) return;
    try {
      await axios.patch(`${API_BASE}/api/admin/approve-clinic/${id}`);
      setPending(prev => prev.filter(c => c.clinic_id !== id));
    } catch (err) {
      console.error("Approval error:", err);
      alert("Approval failed.");
    }
  };

  if (loading) return <div className="admin-loader">Loading Clinic Records...</div>;

  return (
    <div className="admin-page-wrapper">
      <header className="admin-header">
        <div className="header-content">
          <img src="./admin - Copy.png" alt="Portal logo" className="admin-portal-icon" />
          <p>Review and approve PHSRC certifications for new MedHive clinics.</p>
        </div>
        
      </header>

      <main className="admin-main-content">
        {pending.length === 0 ? (
          <div className="empty-state">
            <img src="/Medhive-dashboard.png" alt="MedHive Logo" className="empty-logo" />
            <h3>All clear!</h3>
            <p>No new clinics are currently awaiting verification.</p>
          </div>
        ) : (
          <div className="table-container shadow-sm">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Clinic Identity</th>
                  <th>Contact Information</th>
                  <th>PHSRC Document</th>
                  <th >Review Action</th>
                </tr>
              </thead>
              <tbody>
                {pending.map(clinic => (
                  <tr key={clinic.clinic_id}>
                    <td>
                      <div className="clinic-name-cell">
                        <strong>{clinic.clinic_name}</strong>
                        <span>ID: #{clinic.clinic_id}</span>
                      </div>
                    </td>
                    <td>{clinic.email}</td>
                    <td>
                      <a 
                        href={`${API_BASE}${clinic.phsrc_certificate_image_url}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="document-link"
                      >
                        <i className="fi fi-rr-file-medical"></i> View Certificate
                      </a>
                    </td>
                    <td className="text-center">
                      <button 
                        onClick={() => handleApprove(clinic.clinic_id)}
                        className="approve-btn"
                      >
                        Approve Access
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;