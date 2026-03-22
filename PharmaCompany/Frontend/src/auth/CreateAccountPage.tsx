import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Register.module.css'; 
import medHiveLogo from '../assets/images/MedHive pharma logo.png-.png';

export const CreateAccountPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // State for the image file
  const [certificateFile, setCertificateFile] = useState<File | null>(null);

  // State for text fields
  const [formData, setFormData] = useState({
    companyName: '',
    registrationNumber: '',
    email: '',
    contactNumber: '',
    address: '',
    addressPostalCode: '',
    nmraLicenseNumber: '',
    licenseExpiryDate: '',
    password: '', 
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCertificateFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!certificateFile) {
      setError('Please upload your NMRA certificate image.');
      return;
    }

    setLoading(true);
    setError('');

    // 1. Create FormData object to handle file + text fields
    const data = new FormData();
    data.append('certificate', certificateFile); // Matches backend: upload.single('certificate')
    
    // 2. Append all text fields from state
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      // 3. Direct hit to your Node.js registration endpoint
      const response = await axios.post('http://localhost:5000/api/auth/register', data, {
        headers: {
          'Content-Type': 'multipart/form-data', // Required for file uploads
        },
      });

      if (response.status === 201) {
        console.log("Registration Success:", response.data);
        // Navigate to the verification pending screen
        navigate('/pending-verification');
      }
    } catch (err: any) {
      // 4. Handle backend validation errors (e.g., email already exists)
      const message = err.response?.data?.error || 'Registration failed. Check your server connection.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card} style={{ maxWidth: '650px' }}> 
        <div className={styles.header}>
          <img src={medHiveLogo} className={styles.logo} alt="MedHive Logo" />
          <h2 className={styles.title}>Company Registration</h2>
          <p className={styles.subtitle}>Pharmaceutical Management Platform</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Company Name */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Company Name</label>
            <input
              type="text"
              className={styles.input}
              value={formData.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              placeholder="MedHive Pharma Pvt Ltd"
              required
            />
          </div>

          {/* Email & Registration Number */}
          <div className={styles.formRow}> {/* Changed from inline style flex */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <input
                type="email"
                className={styles.input}
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="admin@company.com"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Registration No</label>
              <input
                type="text"
                className={styles.input}
                value={formData.registrationNumber}
                onChange={(e) => handleChange('registrationNumber', e.target.value)}
                placeholder="REG-12345"
                required
              />
            </div>
          </div>

{/* License Info */}
<div className={styles.formRow}> {/* Changed from inline style flex */}
  <div className={styles.formGroup}>
    <label className={styles.label}>NMRA License Number</label>
    <input
      type="text"
      className={styles.input}
      value={formData.nmraLicenseNumber}
      onChange={(e) => handleChange('nmraLicenseNumber', e.target.value)}
      placeholder="ML-8822"
      required
    />
  </div>
  <div className={styles.formGroup}>
    <label className={styles.label}>License Expiry</label>
    <input
      type="date"
      className={styles.input}
      value={formData.licenseExpiryDate}
      onChange={(e) => handleChange('licenseExpiryDate', e.target.value)}
      required
    />
  </div>
</div>

          {/* Password */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Account Password</label>
            <input
              type="password"
              className={styles.input}
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {/* License Info */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.label}>NMRA License Number</label>
              <input
                type="text"
                className={styles.input}
                value={formData.nmraLicenseNumber}
                onChange={(e) => handleChange('nmraLicenseNumber', e.target.value)}
                placeholder="ML-8822"
                required
              />
            </div>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.label}>License Expiry</label>
              <input
                type="date"
                className={styles.input}
                value={formData.licenseExpiryDate}
                onChange={(e) => handleChange('licenseExpiryDate', e.target.value)}
                required
              />
            </div>
          </div>

          {/* File Upload */}
          <div className={styles.formGroup}>
            <label className={styles.label}>NMRA Certificate Image</label>
            <div className={styles.fileInputWrapper}>
              <input
                type="file"
                id="cert-upload"
                accept="image/*"
                onChange={handleFileChange}
                className={styles.fileInput}
                required
              />
              <label htmlFor="cert-upload" className={styles.fileInputLabel}>
                {certificateFile ? `✅ ${certificateFile.name}` : 'Click to upload certificate image'}
              </label>
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? <span className={styles.loadingSpinner}></span> : 'Register Company'}
          </button>
        </form>

        <div className={styles.footer}>
          Already have an account?{' '}
          <span className={styles.link} onClick={() => navigate('/login')}>
            Log In
          </span>
        </div>
      </div>
    </div>
  );
};