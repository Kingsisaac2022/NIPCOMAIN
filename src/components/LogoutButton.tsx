import React from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { useAuth } from '../hooks/useAuth';
import { useAppContext } from '../context/AppContext';

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { playClickSound } = useAppContext();

  const handleLogout = () => {
    playClickSound();
    logout();
    navigate('/login');
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      icon={<LogOut size={16} />}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;