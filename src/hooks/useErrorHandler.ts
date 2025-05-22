import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function useErrorHandler() {
  const navigate = useNavigate();

  const handleError = useCallback((error: Error) => {
    console.error('Application error:', error);

    if (error.message.includes('Authentication')) {
      navigate('/');
      return;
    }

    if (error.message.includes('Network')) {
      // Handle network errors
      return;
    }

    if (error.message.includes('Permission')) {
      // Handle permission errors
      return;
    }

    // Handle other types of errors
    throw error;
  }, [navigate]);

  return { handleError };
}