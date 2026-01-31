import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../../components/Layout/Sidebar';

const DashboardLayout = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="dashboard-wrapper" style={{ display: 'flex', backgroundColor: '#ffffff' }}>
      <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      
      {/* Top Right Profile Icon - Fixed throughout the site */}
      <div className="top-nav-profile">
        <img src="/icons/profile-user.png" alt="Profile" className="profile-circle" />
      </div>

      <motion.main 
        className="main-content"
        style={{ flex: 1, minHeight: '100vh' }}
        animate={{ marginLeft: isExpanded ? 260 : 80 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <Outlet />
      </motion.main>
    </div>
  );
};

export default DashboardLayout;