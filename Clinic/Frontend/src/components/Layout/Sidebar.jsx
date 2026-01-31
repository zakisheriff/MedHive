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
      className="gemini-sidebar"
      animate={{ width: isExpanded ? 260 : 80 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="sidebar-header">
        <img src="/MedHiveLogo.png" alt="M" className="sidebar-logo" />
        <button className="toggle-arrow" onClick={() => setIsExpanded(!isExpanded)}>
          <motion.img 
            src="/icons/chevron.png" 
            animate={{ rotate: isExpanded ? 180 : 0 }}
            alt="Toggle" 
          />
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink key={item.name} to={item.path} className="nav-item">
            {({ isActive }) => (
              <>
                {/* The "Stick" Indicator that moves up and down */}
                {isActive && (
                  <motion.div 
                    layoutId="activeStick"
                    className="active-stick"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <div className="icon-wrapper">
                  <img src={item.icon} className="custom-icon" alt={item.name} />
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="link-text"
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

      <div className="sidebar-footer">
        <div className="nav-item logout">
          <div className="icon-wrapper">
            <img src="/icons/logout.png" className="custom-icon" alt="Logout" />
          </div>
          {isExpanded && <span className="link-text">Logout</span>}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;