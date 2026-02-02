import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CompanyData } from '../../contexts/AuthContext';
import styles from './Register.module.css';

interface CreateAccountPageProps {
  onNext: (data: CompanyData) => void;
}

export const CreateAccountPage = ({ onNext }: CreateAccountPageProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CompanyData>({
    companyName: '',
    registrationNumber: '',
    email: '',
    contactNumber: '',
    address: '',
    addressPasscode: '',
    nmraLicenseNumber: '',
    licenseExpiryDate: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CompanyData, string>>>({});

  const handleChange = (field: keyof CompanyData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^\+?[\d\s-()]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CompanyData, string>> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = 'Registration number is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!validatePhone(formData.contactNumber)) {
      newErrors.contactNumber = 'Invalid contact number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.addressPasscode.trim()) {
      newErrors.addressPasscode = 'Address passcode is required';
    }

    if (!formData.nmraLicenseNumber.trim()) {
      newErrors.nmraLicenseNumber = 'NMRA license number is required';
    }

    if (!formData.licenseExpiryDate) {
      newErrors.licenseExpiryDate = 'License expiry date is required';
    } else {
      const expiryDate = new Date(formData.licenseExpiryDate);
      if (expiryDate < new Date()) {
        newErrors.licenseExpiryDate = 'License expiry date must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext(formData);
    }
  };

  const isFormValid = () => {
    return Object.values(formData).every(value => value.trim() !== '');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>MedHive Registration</div>
          <p className={styles.subtitle}>Company Information</p>
        </div>

        <div className={styles.stepIndicator}>
          <div className={styles.step}>
            <div className={`${styles.stepCircle} ${styles.active}`}>1</div>
            <span className={`${styles.stepLabel} ${styles.active}`}>Company</span>
          </div>
          <div className={styles.step}>
            <div className={styles.stepCircle}>2</div>
            <span className={styles.stepLabel}>Admin</span>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Company Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={`${styles.input} ${errors.companyName ? styles.error : ''}`}
              value={formData.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              placeholder="Enter company name"
            />
            {errors.companyName && <span className={styles.errorText}>{errors.companyName}</span>}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Company Registration Number <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={`${styles.input} ${errors.registrationNumber ? styles.error : ''}`}
                value={formData.registrationNumber}
                onChange={(e) => handleChange('registrationNumber', e.target.value)}
                placeholder="REG123456"
              />
              {errors.registrationNumber && <span className={styles.errorText}>{errors.registrationNumber}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Email <span className={styles.required}>*</span>
              </label>
              <input
                type="email"
                className={`${styles.input} ${errors.email ? styles.error : ''}`}
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="company@example.com"
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Contact Number <span className={styles.required}>*</span>
              </label>
              <input
                type="tel"
                className={`${styles.input} ${errors.contactNumber ? styles.error : ''}`}
                value={formData.contactNumber}
                onChange={(e) => handleChange('contactNumber', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
              {errors.contactNumber && <span className={styles.errorText}>{errors.contactNumber}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Address Passcode <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={`${styles.input} ${errors.addressPasscode ? styles.error : ''}`}
                value={formData.addressPasscode}
                onChange={(e) => handleChange('addressPasscode', e.target.value)}
                placeholder="12345"
              />
              {errors.addressPasscode && <span className={styles.errorText}>{errors.addressPasscode}</span>}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Address <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={`${styles.input} ${errors.address ? styles.error : ''}`}
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="123 Main Street, City, Country"
            />
            {errors.address && <span className={styles.errorText}>{errors.address}</span>}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                NMRA License Number <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={`${styles.input} ${errors.nmraLicenseNumber ? styles.error : ''}`}
                value={formData.nmraLicenseNumber}
                onChange={(e) => handleChange('nmraLicenseNumber', e.target.value)}
                placeholder="NMRA-123456"
              />
              {errors.nmraLicenseNumber && <span className={styles.errorText}>{errors.nmraLicenseNumber}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                License Expiry Date <span className={styles.required}>*</span>
              </label>
              <input
                type="date"
                className={`${styles.input} ${errors.licenseExpiryDate ? styles.error : ''}`}
                value={formData.licenseExpiryDate}
                onChange={(e) => handleChange('licenseExpiryDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.licenseExpiryDate && <span className={styles.errorText}>{errors.licenseExpiryDate}</span>}
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={`${styles.button} ${styles.secondaryButton}`}
              onClick={() => navigate('/login')}
            >
              Back
            </button>
            <button
              type="submit"
              className={`${styles.button} ${styles.primaryButton}`}
              disabled={!isFormValid()}
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
