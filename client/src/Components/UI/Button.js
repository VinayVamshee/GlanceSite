import React from 'react';
import './Button.css';

export default function Button({ 
  children, 
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
  size = 'medium', // 'small' | 'medium' | 'large'
  isLoading = false,
  disabled = false,
  onClick,
  type = 'button',
  icon,
  ...props 
}) {
  return (
    <button
      type={type}
      className={`btn-custom btn-${variant} btn-${size} ${isLoading ? 'btn-loading' : ''}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading && <span className="btn-spinner"></span>}
      {icon && <span className="btn-icon">{icon}</span>}
      <span className="btn-content">{children}</span>
    </button>
  );
}
