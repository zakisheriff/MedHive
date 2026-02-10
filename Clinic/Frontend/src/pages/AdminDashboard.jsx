const AdminDashboard = () => {
  const [pending, setPending] = useState([]);

  useEffect(() => {
    // Fetch pending clinics
    axios.get(`${API_BASE}/api/admin/pending-clinics`).then(res => setPending(res.data));
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.get(`${API_BASE}/api/auth/approve/${id}`);
      // Remove from UI after approval
      setPending(pending.filter(c => c.clinic_id !== id));
    } catch (err) {
      alert("Approval failed");
    }
  };

  return (
    <div className="admin-container">
      <h2>Pending Clinic Verifications</h2>
      <table>
        <thead>
          <tr>
            <th>Clinic Name</th>
            <th>Certificate</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pending.map(clinic => (
            <tr key={clinic.clinic_id}>
              <td>{clinic.clinic_name}</td>
              <td>
                <a href={`${API_BASE}${clinic.phsrc_certificate_image_url}`} target="_blank">View Certificate</a>
              </td>
              <td>
                <button onClick={() => handleApprove(clinic.clinic_id)}>Approve</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};