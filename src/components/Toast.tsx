import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  onClose,
  duration = 3000
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={20} className="text-success" />,
    error: <AlertTriangle size={20} className="text-error" />,
    info: <Info size={20} className="text-primary" />
  };

  const bgColors = {
    success: 'bg-success/10',
    error: 'bg-error/10',
    info: 'bg-primary/10'
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${bgColors[type]} rounded-lg p-4 shadow-lg border border-gray-700`}>
      <div className="flex items-center gap-3">
        {icons[type]}
        <p className="text-text">{message}</p>
        <button
          onClick={onClose}
          className="ml-2 p-1 hover:bg-background rounded-full transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;