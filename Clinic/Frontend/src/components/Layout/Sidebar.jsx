import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Sidebar.css';

const Sidebar = ({ isExpanded, setIsExpanded, isDarkMode, setIsDarkMode }) => {
  const menuItems = [
    { name: 'Home', path: '/dashboard/home', icon: '/icons/home.png' },
    { name: 'Search', path: '/dashboard/search', icon: '/icons/search.png' },
    { name: 'Prescription', path: '/dashboard/prescription', icon: '/icons/prescription.png' },
    { name: 'History', path: '/dashboard/history', icon: '/icons/history.png' },
  ];

  return (
    <motion.aside 
      className={`sidebar ${isDarkMode ? 'dark' : 'light'}`}
      animate={{ width: isExpanded ? 260 : 80 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="sidebar-header">
        <div className="logo-container">
          <img src="/MedHiveLogo.png" alt="Logo" className="logo-icon" />
          <AnimatePresence>
            {isExpanded && (
              <motion.span 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="brand-name"
              >
                MedHive
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <button className="expand-toggle" onClick={() => setIsExpanded(!isExpanded)}>
          <img 
            src="/icons/chevron.png" 
            style={{ 
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', 
              width: '20px',
              transition: 'transform 0.3s'
            }} 
            alt="toggle" 
          />
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink key={item.name} to={item.path} className="nav-item">
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div 
                    layoutId="activePill"
                    className="active-pill"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <div className="icon-box">
                  <img src={item.icon} className="nav-custom-icon" alt={item.name} />
                </div>
                {isExpanded && <span className="link-label">{item.name}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {/* Toggle Theme globally */}
        <div className="nav-item" onClick={() => setIsDarkMode(!isDarkMode)}>
          <div className="icon-box">
            <img src={isDarkMode ? '/icons/sun.png' : '/icons/moon.png'} className="nav-custom-icon" alt="theme" />
          </div>
          {isExpanded && <span className="link-label">{isDarkMode ? 'Light' : 'Dark'} Mode</span>}
        </div>
        
        <div className="nav-item logout">
          <div className="icon-box"><img src="/icons/logout.png" className="nav-custom-icon" alt="logout" /></div>
          {isExpanded && <span className="link-label">Logout</span>}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;