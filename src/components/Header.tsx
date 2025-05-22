import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronLeft, Calendar, Clock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import LogoutButton from './LogoutButton';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  stationId?: number;
}

const Header: React.FC<HeaderProps> = ({ title, showBack = false, stationId }) => {
  const navigate = useNavigate();
  const { getStationNotifications, playClickSound } = useAppContext();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const unreadCount = stationId 
    ? getStationNotifications(stationId).filter(n => !n.read).length 
    : 0;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
    
  const handleNotificationClick = () => {
    playClickSound();
    if (stationId) {
      navigate(`/notifications/${stationId}`);
    }
  };
  
  const handleBackClick = () => {
    playClickSound();
    navigate(-1);
  };
  
  return (
    <header className="bg-card-bg border-b border-white/5 py-4 px-4 sm:px-6 sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center">
          {showBack && (
            <button 
              onClick={handleBackClick}
              className="mr-3 p-3 bg-primary/10 hover:bg-primary/20 rounded-full transition-colors duration-300 -ml-2"
              aria-label="Go back"
            >
              <ChevronLeft size={28} className="text-primary" />
            </button>
          )}
          <h1 className="text-xl sm:text-2xl font-bold text-text line-clamp-1">{title}</h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-text-secondary">
              <Calendar size={20} className="text-primary" />
              <span>{currentTime.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <Clock size={20} className="text-primary" />
              <span className="font-medium">{currentTime.toLocaleTimeString()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {stationId && (
              <div className="relative">
                <button 
                  onClick={handleNotificationClick}
                  className="p-3 hover:bg-background rounded-full transition-colors duration-300"
                  aria-label="Notifications"
                >
                  <Bell size={28} className="text-primary" />
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                  )}
                </button>
              </div>
            )}
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;