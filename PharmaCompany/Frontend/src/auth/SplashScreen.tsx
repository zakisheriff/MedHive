import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.svg';
import styles from './SplashScreen.module.css';

export const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🎉 Splash screen mounted');
    const timer = setTimeout(() => {
      console.log('✅ Splash screen timeout - redirecting to dashboard');
      navigate('/dashboard');
    }, 4000);

    return () => {
      clearTimeout(timer);
      console.log('🧹 Splash screen cleanup');
    };
  }, [navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <img 
          src={logo}
          alt="MedHive Logo" 
          className={styles.logoImage}
          onLoad={() => console.log('Logo image loaded successfully')}
          onError={() => console.error('Failed to load logo image')}
        />
        <p className={styles.tagline}>Pharmaceutical Management Platform</p>
      </div>
      <div className={styles.spinner}></div>
      <p className={styles.message}>Setting up your workspace...</p>
    </div>
  );
};
