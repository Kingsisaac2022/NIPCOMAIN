import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className={cn(
          "bg-card-bg rounded-2xl border-2 border-gray-700 p-6 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto",
          className
        )}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background rounded-full transition-colors"
          >
            <X size={20} className="text-text-secondary" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;