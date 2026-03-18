import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/Auth/AuthPage';
import DashboardLayout from './pages/Dashboard/Layout';
import Prescriptions from './pages/Dashboard/Prescriptions';
import SearchPage from './pages/Dashboard/Search';
import PatientProfile from './pages/Dashboard/PatientProfile';
import History from './pages/Dashboard/History';
import PendingVerification from './pages/Auth/PendingVerification';
import AdminDashboard from './pages/AdminDashboard';
import RoleSelect from './pages/Dashboard/RoleSelection';


function App() {
  return (
    <Router>
      <Routes>
    
        <Route path="/" element={<AuthPage />} />
        <Route path="/pending-verification" element={<PendingVerification />} />
        <Route path="/admin-portal" element={<AdminDashboard />} />
        <Route index element={<Navigate to="role-select" replace />} />
          <Route path="role-select" element={<RoleSelect />} />
        
        {/* Dashboard Routes: Sidebar is automatically included via Layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
      
          <Route path="search" element={<SearchPage />} />
          <Route path="patientProfile" element={<PatientProfile />} />
          <Route path="prescription" element={<Prescriptions/>} />
          <Route path="history" element={<History/>} />
          
        </Route>
      </Routes>
    </Router>
  );
}

export default App;