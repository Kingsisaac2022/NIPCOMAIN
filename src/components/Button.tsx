import React from 'react';
import { useAppContext } from '../context/AppContext';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  disabled = false,
  type = 'button',
  icon
}) => {
  const { playClickSound } = useAppContext();
  
  const handleClick = () => {
    playClickSound();
    if (onClick) onClick();
  };
  
  const sizeClasses = {
    sm: 'text-sm px-4 py-2',
    md: 'px-6 py-3',
    lg: 'text-lg px-8 py-4',
  };
  
  const variantClasses = {
    primary: 'btn-primary',
    outline: 'btn-outline',
    danger: 'bg-error hover:bg-error/80 text-white border-error',
  };
  
  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`
        btn ${variantClasses[variant]} ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;

export { Button }