import { useAuth } from '../contexts/AuthContext';
import styles from './Login.module.css';

export const LoginPageTest = () => {
  const { login } = useAuth();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>MedHive</div>
          <p className={styles.subtitle}>Pharmaceutical Management Platform</p>
        </div>
        <div style={{ padding: '1rem' }}>
          <p>Test Page - Login Page Component Loaded</p>
          <button 
            className={styles.button}
            onClick={() => console.log('Button clicked')}
          >
            Test Button
          </button>
        </div>
      </div>
    </div>
  );
};
