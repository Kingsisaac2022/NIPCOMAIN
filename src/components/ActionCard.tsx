import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

interface ActionCardProps {
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
  route?: string;
  disabled?: boolean;
}

const ActionCard: React.FC<ActionCardProps> = ({ 
  title, 
  icon, 
  onClick, 
  route, 
  disabled = false 
}) => {
  const navigate = useNavigate();
  const { playClickSound } = useAppContext();
  
  const handleClick = () => {
    if (disabled) return;
    
    playClickSound();
    
    if (onClick) {
      onClick();
    } else if (route) {
      navigate(route);
    }
  };
  
  return (
    <div 
      className={`
        card flex flex-col items-center py-8 px-4 text-center
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary'}
      `}
      onClick={handleClick}
    >
      <div className="p-4 bg-background rounded-full mb-4 text-primary">
        {icon}
      </div>
      <h3 className="text-lg font-bold">{title}</h3>
    </div>
  );
};

export default ActionCard;