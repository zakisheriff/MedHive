import { createContext, useContext, useState, ReactNode } from 'react';

export interface CompanyData {
  companyName: string;
  registrationNumber: string;
  email: string;
  contactNumber: string;
  address: string;
  addressPasscode: string;
  nmraLicenseNumber: string;
  licenseExpiryDate: string;
}

export interface AdminData {
  fullName: string;
  workPosition: string;
  email: string;
  contactNumber: string;
  password: string;
  confirmPassword: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: { email: string; role: string } | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithOTP: (email: string, otp: string) => Promise<boolean>;
  register: (companyData: CompanyData, adminData: AdminData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call
      // Replace this with your actual authentication logic
      console.log('Attempting login with:', email);
      
      // Mock success for demo purposes
      setIsAuthenticated(true);
      setUser({ email, role: 'admin' });
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const loginWithOTP = async (email: string, otp: string): Promise<boolean> => {
    try {
      // Simulate API call
      console.log('Verifying OTP for:', email, otp);
      
      // Mock success for demo purposes
      setIsAuthenticated(true);
      setUser({ email, role: 'admin' });
      return true;
    } catch (error) {
      console.error('OTP verification failed:', error);
      return false;
    }
  };

  const register = async (companyData: CompanyData, adminData: AdminData): Promise<void> => {
    try {
      // Simulate API call
      console.log('Registering company:', companyData);
      console.log('Creating admin user:', adminData);
      
      // Mock success for demo purposes
      setIsAuthenticated(true);
      setUser({ email: adminData.email, role: 'admin' });
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    loginWithOTP,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
