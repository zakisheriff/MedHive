import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { LoginPage } from './features/auth/LoginPage';
import { RegistrationFlow } from './features/auth/RegistrationFlow';
import { DashboardApp } from './DashboardApp';
import './index.css';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegistrationFlow />}
      />
      <Route
        path="/dashboard/*"
        element={isAuthenticated ? <DashboardApp /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
