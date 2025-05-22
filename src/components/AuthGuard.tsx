import React, { useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

const AuthGuard: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [location.pathname]);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated && location.pathname !== '/login') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Redirect to dashboard if already authenticated and trying to access login
  if (isAuthenticated && location.pathname === '/login') {
    const stationId = sessionStorage.getItem('stationId');
    const redirectPath = stationId === '1' ? '/ceo' : `/station/${stationId}`;
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default AuthGuard;