import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './Button';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card-bg p-8 rounded-xl border-2 border-error/50 max-w-lg w-full text-center">
        <AlertTriangle size={48} className="text-error mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="text-text-secondary mb-6">{error.message}</p>
        <Button onClick={resetErrorBoundary} variant="primary">
          Try again
        </Button>
      </div>
    </div>
  );
};

export default ErrorFallback;