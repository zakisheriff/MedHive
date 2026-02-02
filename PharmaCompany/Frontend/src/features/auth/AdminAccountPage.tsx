import { useState } from 'react';
import type { AdminData, CompanyData } from '../../contexts/AuthContext';
import styles from './Register.module.css';

interface AdminAccountPageProps {
  companyData: CompanyData;
  onBack: () => void;
  onNext: (data: AdminData) => void;
}

export const AdminAccountPage = ({ companyData: _companyData, onBack, onNext }: AdminAccountPageProps) => {
  const [formData, setFormData] = useState<AdminData>({
    fullName: '',
    workPosition: '',
    email: '',
    contactNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof AdminData, string>>>({});
  // Uncomment these if you want to add show/hide password toggles
  // const [showPassword, setShowPassword] = useState(false);
  // const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field: keyof AdminData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' | null => {
    if (!password) return null;
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 1) return 'weak';
    if (strength === 2 || strength === 3) return 'medium';
    return 'strong';
  };

  const validatePassword = (password: string): string[] => {
    const requirements: string[] = [];
    
    if (password.length < 8) requirements.push('At least 8 characters');
    if (!/[a-z]/.test(password)) requirements.push('One lowercase letter');
    if (!/[A-Z]/.test(password)) requirements.push('One uppercase letter');
    if (!/\d/.test(password)) requirements.push('One number');
    if (!/[^a-zA-Z0-9]/.test(password)) requirements.push('One special character');

    return requirements;
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^\+?[\d\s-()]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AdminData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.workPosition.trim()) {
      newErrors.workPosition = 'Work position is required';
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

    const passwordRequirements = validatePassword(formData.password);
    if (passwordRequirements.length > 0) {
      newErrors.password = 'Password does not meet requirements';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext(formData);
      console.log("Yooo");
    }
  };

  const isFormValid = () => {
    return (
      Object.values(formData).every(value => value.trim() !== '') &&
      validatePassword(formData.password).length === 0 &&
      formData.password === formData.confirmPassword
    );
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordRequirements = validatePassword(formData.password);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>MedHive Registration</div>
          <p className={styles.subtitle}>Admin Account Setup</p>
        </div>

        <div className={styles.stepIndicator}>
          <div className={styles.step}>
            <div className={styles.stepCircle}>1</div>
            <span className={styles.stepLabel}>Company</span>
          </div>
          <div className={styles.step}>
            <div className={`${styles.stepCircle} ${styles.active}`}>2</div>
            <span className={`${styles.stepLabel} ${styles.active}`}>Admin</span>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Full Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={`${styles.input} ${errors.fullName ? styles.error : ''}`}
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="John Doe"
              />
              {errors.fullName && <span className={styles.errorText}>{errors.fullName}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Work Position <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={`${styles.input} ${errors.workPosition ? styles.error : ''}`}
                value={formData.workPosition}
                onChange={(e) => handleChange('workPosition', e.target.value)}
                placeholder="Chief Pharmacist"
              />
              {errors.workPosition && <span className={styles.errorText}>{errors.workPosition}</span>}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Email <span className={styles.required}>*</span>
              </label>
              <input
                type="email"
                className={`${styles.input} ${errors.email ? styles.error : ''}`}
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="john.doe@company.com"
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>

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
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Password <span className={styles.required}>*</span>
            </label>
            <input
              type="password"
              className={`${styles.input} ${errors.password ? styles.error : ''}`}
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="••••••••"
            />
            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            
            {formData.password && (
              <div className={styles.passwordStrength}>
                <div className={styles.strengthBar}>
                  <div className={`${styles.strengthFill} ${passwordStrength ? styles[passwordStrength] : ''}`}></div>
                </div>
                <div className={`${styles.strengthText} ${passwordStrength ? styles[passwordStrength] : ''}`}>
                  {passwordStrength === 'weak' && 'Weak password'}
                  {passwordStrength === 'medium' && 'Medium strength'}
                  {passwordStrength === 'strong' && 'Strong password'}
                </div>
                {passwordRequirements.length > 0 && (
                  <ul className={styles.requirementsList}>
                    <li>Password must contain:</li>
                    {passwordRequirements.map((req, idx) => (
                      <li key={idx}>• {req}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Confirm Password <span className={styles.required}>*</span>
            </label>
            <input
              type="password"
              className={`${styles.input} ${errors.confirmPassword ? styles.error : ''}`}
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              placeholder="••••••••"
            />
            {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={`${styles.button} ${styles.secondaryButton}`}
              onClick={onBack}
            >
              Back
            </button>
            <button
              type="submit"
              className={`${styles.button} ${styles.primaryButton}`}
              disabled={!isFormValid()}
            >
              Complete Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
