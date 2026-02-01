import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Sidebar.css';

const Sidebar = ({ isExpanded, setIsExpanded }) => {
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Home', path: '/dashboard/home', icon: '/icons/home.png' },
    { name: 'Search', path: '/dashboard/search', icon: '/icons/search.png' },
    { name: 'Prescription', path: '/dashboard/prescription', icon: '/icons/prescription.png' },
    { name: 'History', path: '/dashboard/history', icon: '/icons/history.png' },
  ];

  const handleLogout = () =>{
      navigate("/auth");
  }

  return (
    <motion.aside 
      className="gemini-sidebar"
      animate={{ width: isExpanded ? 260 : 100 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* 1. Header: Clicking the logo group now toggles the sidebar */}
      <div 
        className="sidebar-header" 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ cursor: 'pointer' }}
        title={!isExpanded ? "Expand menu" : "Collapse menu"}
      >
        <div className="logo-group">
          <img src="/MedHiveLogo.png" alt="M" className="sidebar-logo" />
          <AnimatePresence>
            {isExpanded && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="logo-text"
              >
                MedHive
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 2. Navigation Items */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path} 
            className="nav-item"
            title={!isExpanded ? item.name : ""}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div 
                    layoutId="activeStick"
                    className="active-stick"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <div className="icon-box">
                  <img src={item.icon} className="custom-icon" alt={item.name} />
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="nav-label"
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

      {/* 3. Footer: Logout */}
      <div className="sidebar-footer">
        <div className="nav-item logout-link" title={!isExpanded ? "Logout" : ""} onClick={handleLogout} style={{ cursor: 'pointer' }} >
          <div className="icon-box">
            <img src="/icons/logout.png" className="custom-icon" alt="Logout" />
          </div>
          {isExpanded && <span className="nav-label">Logout</span>}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;