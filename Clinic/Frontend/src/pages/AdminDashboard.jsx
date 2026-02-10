import React, { useState, useEffect } from "react";
import axios from "axios";

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
    try {
      // Hits the PATCH route we defined in server.js
      await axios.patch(`${API_BASE}/api/admin/approve-clinic/${id}`);
      
      setPending(prev => prev.filter(c => c.clinic_id !== id));
      alert("Clinic approved successfully!");
    } catch (err) {
      console.error("Approval error:", err);
      alert("Approval failed. Check console for details.");
    }
  };

  if (loading) return <div>Loading pending clinics...</div>;

  return (
    <div className="admin-container" style={{ padding: '20px' }}>
      <h2>Pending Clinic Verifications</h2>
      {pending.length === 0 ? (
        <p>No clinics currently awaiting approval.</p>
      ) : (
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ background: '#f4f4f4' }}>
              <th style={{ padding: '10px' }}>Clinic Name</th>
              <th style={{ padding: '10px' }}>Email</th>
              <th style={{ padding: '10px' }}>Certificate</th>
              <th style={{ padding: '10px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {pending.map(clinic => (
              <tr key={clinic.clinic_id}>
                <td style={{ padding: '10px' }}>{clinic.clinic_name}</td>
                <td style={{ padding: '10px' }}>{clinic.email}</td>
                <td style={{ padding: '10px' }}>
                  <a 
                    href={`${API_BASE}${clinic.phsrc_certificate_image_url}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    View PHSRC Certificate
                  </a>
                </td>
                <td style={{ padding: '10px' }}>
                  <button 
                    onClick={() => handleApprove(clinic.clinic_id)}
                    style={{ background: '#28a745', color: 'white', border: 'none', padding: '5px 15px', cursor: 'pointer', borderRadius: '4px' }}
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;