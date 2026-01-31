import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../../components/Layout/Sidebar';


const DashboardLayout = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ 
        marginLeft: '260px', /* Width of sidebar */
        width: 'calc(100% - 260px)',
        minHeight: '100vh',
        backgroundColor: '#ffffff' 
      }}>
        {/* Animated Page Transition Container */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardLayout;