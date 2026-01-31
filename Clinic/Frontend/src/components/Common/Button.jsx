import React from 'react';

const Button = ({ children, onClick, type = "button", variant = "primary" }) => (
  <button 
    type={type} 
    onClick={onClick} 
    className={`custom-btn btn-${variant}`}
  >
    {children}
  </button>
);

export default Button;