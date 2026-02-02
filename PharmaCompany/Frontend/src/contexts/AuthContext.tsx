import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface User {
  email: string;
  fullName: string;
  companyName: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithOTP: (email: string, otp: string) => Promise<boolean>;
  register: (companyData: CompanyData, adminData: AdminData) => Promise<boolean>;
  logout: () => void;
}

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Placeholder for API call
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock authentication - in production, this would call your backend
    if (email && password) {
      setUser({
        email,
        fullName: 'John Doe',
        companyName: 'Pharma Corp'
      });
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const loginWithOTP = async (email: string, otp: string): Promise<boolean> => {
    // Placeholder for OTP verification API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (email && otp.length === 6) {
      setUser({
        email,
        fullName: 'John Doe',
        companyName: 'Pharma Corp'
      });
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const register = async (companyData: CompanyData, adminData: AdminData): Promise<boolean> => {
    // Placeholder for registration API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUser({
      email: adminData.email,
      fullName: adminData.fullName,
      companyName: companyData.companyName
    });
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, loginWithOTP, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
