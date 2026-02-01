import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/Auth/AuthPage';
import DashboardLayout from './pages/Dashboard/Layout';
import Home from './pages/Dashboard/Home';
import Prescriptions from './pages/Dashboard/Prescriptions';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Route: No Sidebar here */}
        <Route path="/" element={<AuthPage />} />

        {/* Dashboard Routes: Sidebar is automatically included via Layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="search" element={<div></div>} />
          <Route path="prescription" element={<Prescriptions/>} />
          <Route path="history" element={<div></div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;