import { useState, useCallback } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  stationId: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    stationId: null
  });

  const checkAuth = useCallback(() => {
    setState(prev => ({ ...prev, isLoading: true }));

    const authenticated = sessionStorage.getItem('authenticated') === 'true';
    const stationId = sessionStorage.getItem('stationId');

    setState({
      isAuthenticated: authenticated,
      isLoading: false,
      stationId
    });
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('authenticated');
    sessionStorage.removeItem('stationId');
    setState({
      isAuthenticated: false,
      isLoading: false,
      stationId: null
    });
  }, []);

  return {
    ...state,
    checkAuth,
    logout
  };
}