import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { SplashScreen } from './SplashScreen';
import styles from './Login.module.css';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        console.log('Login successful - showing splash screen');
        setShowSplash(true);
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!validateEmail(email)) {
      setError('Please enter your email address first');
      return;
    }
    setShowOTP(true);
    setError('');
    // Placeholder: Send OTP to email
    console.log('OTP sent to:', email);
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  if (showOTP) {
    return <OTPVerification email={email} onBack={() => setShowOTP(false)} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>MedHive</div>
          <p className={styles.subtitle}>Pharmaceutical Management Platform</p>
        </div>

        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@company.com"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className={styles.forgotPassword}>
            <span className={styles.link} onClick={handleForgotPassword}>
              Forgot Password?
            </span>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? <span className={styles.loading}></span> : 'Log In'}
          </button>
        </form>

        <div className={styles.footer}>
          Don't have an account?{' '}
          <span className={styles.link} onClick={() => navigate('/register')}>
            Register an account
          </span>
        </div>
      </div>
    </div>
  );
};

const OTPVerification = ({ email, onBack }: { email: string; onBack: () => void }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const { loginWithOTP } = useAuth();

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const success = await loginWithOTP(email, otpValue);
      if (success) {
        setShowSplash(true);
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>Verify OTP</div>
          <p className={styles.subtitle}>
            Enter the 6-digit code sent to<br />
            <strong>{email}</strong>
          </p>
        </div>

        <form className={styles.form} onSubmit={handleVerifyOTP}>
          <div className={styles.otpContainer}>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                className={styles.otpInput}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength={1}
                autoFocus={index === 0}
              />
            ))}
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? <span className={styles.loading}></span> : 'Verify & Login'}
          </button>

          <button type="button" className={styles.backButton} onClick={onBack}>
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};
