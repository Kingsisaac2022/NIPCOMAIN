import React from 'react';
import { useParams } from 'react-router-dom';
import { Bell, AlertCircle, Truck, DollarSign, Info } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Header from '../components/Header';

const NotificationsPage: React.FC = () => {
  const { stationId } = useParams<{ stationId: string }>();
  const { getStation, getStationNotifications, markNotificationAsRead } = useAppContext();
  
  const id = parseInt(stationId || '0');
  const station = getStation(id);
  const notifications = getStationNotifications(id);
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'Order':
        return <Truck size={20} className="text-primary" />;
      case 'Offload':
        return <Truck size={20} className="text-success" />;
      case 'Payment':
        return <DollarSign size={20} className="text-warning" />;
      default:
        return <Info size={20} className="text-text-secondary" />;
    }
  };
  
  const handleNotificationClick = (notificationId: number) => {
    markNotificationAsRead(notificationId);
  };
  
  if (!station) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-text">Station not found</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header title="Notifications" showBack stationId={station.id} />
      
      <main className="page-container fade-in">
        <div className="card">
          <div className="flex items-center mb-6">
            <Bell size={24} className="text-primary mr-3" />
            <h2 className="text-xl font-bold">
              Notifications for {station.name}
            </h2>
          </div>
          
          {notifications.length > 0 ? (
            <div className="divide-y divide-gray-700">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`
                    py-4 first:pt-0 last:pb-0 
                    ${!notification.read ? 'bg-card-bg relative' : ''}
                    cursor-pointer
                  `}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  {!notification.read && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                  )}
                  
                  <div className="flex">
                    <div className="mr-4 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold mb-1">{notification.title}</h4>
                        <span className="text-xs text-text-secondary">
                          {new Date(notification.dateTime).toLocaleString()}
                        </span>
                      </div>
                      
                      <p className="text-text-secondary">
                        {notification.message}
                      </p>
                      
                      {!notification.read && (
                        <div className="flex items-center mt-2">
                          <AlertCircle size={16} className="text-primary mr-1" />
                          <span className="text-xs font-medium text-primary">New</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bell size={40} className="text-text-secondary mx-auto mb-4" />
              <p className="text-text-secondary">No notifications to display.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NotificationsPage;