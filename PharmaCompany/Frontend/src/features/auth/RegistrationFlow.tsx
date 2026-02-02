import { useState } from 'react';
import { CreateAccountPage } from './CreateAccountPage';
import { AdminAccountPage } from './AdminAccountPage';
import type { CompanyData, AdminData } from '../../contexts/AuthContext';
import { useAuth } from '../../contexts/AuthContext';
import { SplashScreen } from './SplashScreen';

export const RegistrationFlow = () => {
  const [step, setStep] = useState<'company' | 'admin' | 'splash'>('company');
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [showSplash, setShowSplash] = useState(false);
  const { register } = useAuth();

  const handleCompanyNext = (data: CompanyData) => {
    setCompanyData(data);
    setStep('admin');
  };

  const handleAdminBack = () => {
    setStep('company');
  };

  const handleAdminNext = async (adminData: AdminData) => {
    if (!companyData) return;

    setShowSplash(true);
    
    // Call the registration API
    try {
      await register(companyData, adminData);
      // Splash screen will auto-redirect after animation
    } catch (error) {
      console.error('Registration failed:', error);
      setShowSplash(false);
      // Handle error appropriately
    }
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  if (step === 'company') {
    return <CreateAccountPage onNext={handleCompanyNext} />;
  }

  if (step === 'admin' && companyData) {
    return (
      <AdminAccountPage
        companyData={companyData}
        onBack={handleAdminBack}
        onNext={handleAdminNext}
      />
    );
  }

  return null;
};
