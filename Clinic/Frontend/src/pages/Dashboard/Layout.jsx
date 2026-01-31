import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../../components/Layout/Sidebar';

const DashboardLayout = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to Gemini Light Mode

  // Apply the theme class to the body so every page reacts
  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
  }, [isDarkMode]);

  return (
    <div style={{ display: 'flex' }}>
      {/* Pass both states and their setters down to the Sidebar */}
      <Sidebar 
        isExpanded={isExpanded} 
        setIsExpanded={setIsExpanded} 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
      />
      
      <motion.main 
        style={{ 
          flex: 1, 
          minHeight: '100vh',
          // Matches the "Joined" pill color based on the theme
          backgroundColor: isDarkMode ? '#131314' : '#ffffff' 
        }}
        animate={{ marginLeft: isExpanded ? 260 : 80 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <Outlet />
      </motion.main>
    </div>
  );
};

export default DashboardLayout;