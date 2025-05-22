import React from 'react';
import { cn } from '../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div 
      className={cn(
        "bg-card-bg rounded-2xl border-2 border-gray-700 p-6 shadow-lg transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card