import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  CircleDollarSign, 
  FileText, 
  Database, 
  Users, 
  Gauge,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  Plus
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { playClickSound } = useAppContext();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { icon: CircleDollarSign, label: 'Finance', path: '/ceo/finance' },
    { icon: FileText, label: 'Orders', path: '/ceo/create-purchase-order' },
    { icon: Database, label: 'Tanks', path: '/ceo/price-update' },
    { icon: Plus, label: 'Create Tank', path: '/ceo/tanks/create' },
    { icon: Users, label: 'Staff', path: '/ceo/staff' },
    { icon: Gauge, label: 'Dispensers', path: '/ceo/dispensers' },
    { icon: MessageSquare, label: 'AI Config', path: '/ceo/ai-config' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNavClick = (path: string) => {
    playClickSound();
    navigate(path);
  };

  return (
    <nav className={`
      fixed left-0 top-0 h-screen bg-card-bg border-r border-gray-700 transition-all duration-300
      ${isCollapsed ? 'w-20' : 'w-64'}
      z-40
    `}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-8 bg-primary rounded-full p-2 shadow-lg"
      >
        {isCollapsed ? (
          <ChevronRight size={16} className="text-background" />
        ) : (
          <ChevronLeft size={16} className="text-background" />
        )}
      </button>

      <div className="p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavClick(item.path)}
            className={`
              w-full flex items-center p-3 rounded-lg transition-colors
              ${isActive(item.path) 
                ? 'bg-primary text-background' 
                : 'text-text-secondary hover:bg-background hover:text-text'
              }
            `}
          >
            <item.icon size={24} />
            {!isCollapsed && (
              <span className="ml-3 font-medium whitespace-nowrap">{item.label}</span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;