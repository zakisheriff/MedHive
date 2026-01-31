import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Sidebar.css';

const Sidebar = ({ isExpanded, setIsExpanded }) => {
  const menuItems = [
    { name: 'Home', path: '/dashboard/home', icon: '/icons/home.png' },
    { name: 'Search', path: '/dashboard/search', icon: '/icons/search.png' },
    { name: 'Prescription', path: '/dashboard/prescription', icon: '/icons/prescription.png' },
    { name: 'History', path: '/dashboard/history', icon: '/icons/history.png' },
  ];

  return (
    <motion.aside 
      className="sidebar"
      animate={{ width: isExpanded ? 260 : 84 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="sidebar-header">
        <div className="logo-container">
          <img src="/MedHiveLogo.png" alt="M" className="logo-icon" />
          <AnimatePresence>
            {isExpanded && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="brand-name"
              >
                MedHive
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        {/* Toggle button matches the reference style */}
        <button className="expand-toggle" onClick={() => setIsExpanded(!isExpanded)}>
          <img 
            src="/icons/toggle.png" 
            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }} 
            alt="toggle" 
          />
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink key={item.name} to={item.path} className="nav-item">
            {({ isActive }) => (
              <>
                {/* This background expands from a circle to a pill */}
                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="active-bg-indicator"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <div className="icon-box">
                  <img src={item.icon} className="nav-custom-icon" alt={item.name} />
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="link-label"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout placed at the bottom */}
      <div className="sidebar-footer">
        <div className="nav-item logout-item">
          <div className="icon-box">
            <img src="/icons/logout.png" className="nav-custom-icon" alt="logout" />
          </div>
          {isExpanded && <span className="link-label">Logout</span>}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;