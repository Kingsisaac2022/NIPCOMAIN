import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  CircleDollarSign, 
  Users, 
  Gauge, 
  MessageSquare, 
  FileText,
  Database,
  Plus
} from 'lucide-react';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { icon: CircleDollarSign, label: 'Finance', path: '/ceo/finance' },
    { icon: FileText, label: 'Orders', path: '/ceo/create-purchase-order' },
    { icon: Database, label: 'Tanks', path: '/ceo/price-update' },
    { icon: Plus, label: 'Create Tank', path: '/ceo/tanks/create' },
    { icon: Users, label: 'Staff', path: '/ceo/staff' },
    { icon: Gauge, label: 'Dispensers', path: '/ceo/dispensers' },
    { icon: MessageSquare, label: 'AI Config', path: '/ceo/ai-config' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card-bg border-t border-gray-700 px-4 py-2 z-50">
      <div className="max-w-[1400px] mx-auto flex justify-around">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`
              flex flex-col items-center p-2 rounded-lg transition-colors
              ${isActive(item.path) 
                ? 'bg-primary text-background' 
                : 'text-text-secondary hover:text-text hover:bg-background'
              }
            `}
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-lg mb-1">
              <item.icon size={24} />
            </div>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;