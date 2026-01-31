import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const logo = "/medhive-logo-sidebar.png"; // Your horizontal logo with text

  const menuItems = [
    { name: 'Home', path: '/home', icon: '/icons/home.svg' },
    { name: 'Search', path: '/search', icon: '/icons/search.svg' },
    { name: 'Prescription', path: '/prescription', icon: '/icons/presc.svg' },
    { name: 'History', path: '/history', icon: '/icons/history.svg' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src={logo} alt="MedHive" className="brand-img" />
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.name} to={item.path} className={`nav-link ${isActive ? 'active' : ''}`}>
              {/* Active Pill Background Animation */}
              {isActive && (
                <motion.div 
                  layoutId="activePill"
                  className="active-indicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <div className="link-content">
                <img src={item.icon} alt={item.name} className="nav-icon" />
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <p>© 2026 MedHive</p>
      </div>
    </aside>
  );
};

export default Sidebar;