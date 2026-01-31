import React from 'react';
import './Common.css';

const GlassCard = ({ children, className = "" }) => (
  <div className={`glass-card ${className}`}>
    {children}
  </div>
);

export default GlassCard;