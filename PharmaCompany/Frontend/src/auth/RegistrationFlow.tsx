import { useState } from 'react';
import { CreateAccountPage } from './CreateAccountPage';
import { SplashScreen } from './SplashScreen';

export const RegistrationFlow = () => {
  const [showSplash, setShowSplash] = useState(false);

  /**
   * Since the CreateAccountPage now handles the full registration,
   * we only need to know if we should show the Splash animation
   * before the final redirect.
   */
  const handleRegistrationSuccess = () => {
    setShowSplash(true);
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  // We no longer need to check for 'step' or 'adminData'
  return <CreateAccountPage onRegisterSuccess={handleRegistrationSuccess} />;
};  