import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/Auth/AuthPage';
import DashboardLayout from './pages/Dashboard/Layout';
import Home from './pages/Dashboard/Home';
import Prescriptions from './pages/Dashboard/Prescriptions';
import SearchPage from './pages/Dashboard/Search';
import PatientProfile from './pages/Dashboard/PatientProfile';
import History from './pages/Dashboard/History';
import PendingVerification from './pages/Auth/PendingVerification';
import AdminDashboard from './pages/AdminDashboard';


function App() {
  return (
    <Router>
      <Routes>
    
        <Route path="/" element={<AuthPage />} />
        <Route path="/pending-verification" element={<PendingVerification />} />
        <Route path="/admin-portal" element={<AdminDashboard />} />
        
        {/* Dashboard Routes: Sidebar is automatically included via Layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
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