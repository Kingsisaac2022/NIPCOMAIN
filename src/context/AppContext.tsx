import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import { Station, PurchaseOrder, Notification, DriverOffload, Tank, TankOffload } from '../types';

interface AppContextType {
  stations: Station[];
  purchaseOrders: PurchaseOrder[];
  notifications: Notification[];
  driverOffloads: DriverOffload[];
  tankOffloads: TankOffload[];
  updateStation: (station: Station) => void;
  createPurchaseOrder: (order: Omit<PurchaseOrder, 'id'>) => Promise<void>;
  updatePurchaseOrder: (order: PurchaseOrder) => void;
  createDriverOffload: (offload: Omit<DriverOffload, 'id'>) => void;
  getStationNotifications: (stationId: number) => Notification[];
  markNotificationAsRead: (notificationId: number) => void;
  playClickSound: () => void;
  playNotificationSound: () => void;
  getStation: (id: number) => Station | undefined;
  createTank: (stationId: number, tank: Omit<Tank, 'id' | 'stationId'>) => void;
  updateTank: (tank: Tank) => void;
  deleteTank: (stationId: number, tankId: number) => void;
  createTankOffload: (offload: Omit<TankOffload, 'id'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialStations: Station[] = [
  {
    id: 1,
    name: "CEO",
    managerName: "Mr Chike Aniekwe",
    managerPhone: "+234 703 555 1234",
    address: "Abakiliki, Ebonyi State",
    active: true,
    tanks: [],
    staff: [],
    dispensers: [],
    sales: [],
    expenses: [],
    financialReports: []
  },
  {
    id: 2,
    name: "NIPCO Station Abakiliki",
    managerName: "Emmanuel Nwodo",
    managerPhone: "+234 802 555 2345",
    address: "45 Ogoja Road, Abakiliki",
    active: true,
    tanks: [],
    staff: [],
    dispensers: [],
    sales: [],
    expenses: [],
    financialReports: []
  },
  {
    id: 3,
    name: "NIPCO Station Uyo 1",
    managerName: "Mercy Effiong",
    managerPhone: "+234 813 555 3456",
    address: "12 Ikot Ekpene Road, Uyo",
    active: true,
    tanks: [],
    staff: [],
    dispensers: [],
    sales: [],
    expenses: [],
    financialReports: []
  },
  {
    id: 4,
    name: "NIPCO Station Uyo 2",
    managerName: "Peter Akpan",
    managerPhone: "+234 705 555 4567",
    address: "78 Oron Road, Uyo",
    active: true,
    tanks: [],
    staff: [],
    dispensers: [],
    sales: [],
    expenses: [],
    financialReports: []
  },
  {
    id: 5,
    name: "NIPCO Station Ikot-Ekpene",
    managerName: "Sarah Udoh",
    managerPhone: "+234 809 555 5678",
    address: "23 Aba Road, Ikot-Ekpene",
    active: true,
    tanks: [],
    staff: [],
    dispensers: [],
    sales: [],
    expenses: [],
    financialReports: []
  },
  {
    id: 6,
    name: "NIPCO Station Ibaka",
    managerName: "John Okon",
    managerPhone: "+234 811 555 6789",
    address: "15 Marina Road, Ibaka",
    active: true,
    tanks: [],
    staff: [],
    dispensers: [],
    sales: [],
    expenses: [],
    financialReports: []
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stations, setStations] = useState<Station[]>(() => {
    const stored = localStorage.getItem('stations');
    return stored ? JSON.parse(stored) : initialStations;
  });
  
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    const stored = localStorage.getItem('purchaseOrders');
    return stored ? JSON.parse(stored) : [];
  });
  
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const stored = localStorage.getItem('notifications');
    return stored ? JSON.parse(stored) : [];
  });
  
  const [driverOffloads, setDriverOffloads] = useState<DriverOffload[]>(() => {
    const stored = localStorage.getItem('driverOffloads');
    return stored ? JSON.parse(stored) : [];
  });

  const [tankOffloads, setTankOffloads] = useState<TankOffload[]>(() => {
    const stored = localStorage.getItem('tankOffloads');
    return stored ? JSON.parse(stored) : [];
  });

  const [clickSound, setClickSound] = useState<HTMLAudioElement | null>(null);
  const [notificationSound, setNotificationSound] = useState<HTMLAudioElement | null>(null);
  const [realtimeChannels, setRealtimeChannels] = useState<RealtimeChannel[]>([]);

  useEffect(() => {
    const click = new Audio('/sounds/click.mp3');
    click.volume = 0.2;
    click.preload = 'auto';
    setClickSound(click);

    const notification = new Audio('/sounds/notification.mp3');
    notification.volume = 0.5;
    notification.preload = 'auto';
    setNotificationSound(notification);

    return () => {
      click?.pause();
      notification?.pause();
    };
  }, []);

  useEffect(() => {
    stations.forEach(station => {
      const tankChannel = supabase
        .channel(`tanks:${station.id}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'tanks',
          filter: `station_id=eq.${station.id}`
        }, (payload) => {
          const { new: newTank } = payload;
          if (newTank) {
            setStations(prev => prev.map(s => {
              if (s.id === station.id) {
                return {
                  ...s,
                  tanks: s.tanks.map(t => t.id === newTank.id ? newTank : t)
                };
              }
              return s;
            }));
          }
        })
        .subscribe();

      const salesChannel = supabase
        .channel(`sales:${station.id}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'sales',
          filter: `station_id=eq.${station.id}`
        }, (payload) => {
          const { new: newSale } = payload;
          if (newSale) {
            setStations(prev => prev.map(s => {
              if (s.id === station.id) {
                return {
                  ...s,
                  sales: [...(s.sales || []), newSale]
                };
              }
              return s;
            }));
          }
        })
        .subscribe();

      setRealtimeChannels(prev => [...prev, tankChannel, salesChannel]);
    });

    return () => {
      realtimeChannels.forEach(channel => {
        channel.unsubscribe();
      });
    };
  }, [stations.map(s => s.id).join(',')]);

  useEffect(() => {
    localStorage.setItem('stations', JSON.stringify(stations));
  }, [stations]);

  useEffect(() => {
    localStorage.setItem('purchaseOrders', JSON.stringify(purchaseOrders));
  }, [purchaseOrders]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('driverOffloads', JSON.stringify(driverOffloads));
  }, [driverOffloads]);

  useEffect(() => {
    localStorage.setItem('tankOffloads', JSON.stringify(tankOffloads));
  }, [tankOffloads]);

  const updateStation = (updatedStation: Station) => {
    setStations(prev => 
      prev.map(station => 
        station.id === updatedStation.id ? updatedStation : station
      )
    );
  };

  const createPurchaseOrder = async (newOrder: Omit<PurchaseOrder, 'id'>): Promise<void> => {
    const orderWithId = {
      ...newOrder,
      id: Date.now(),
    };
    
    setPurchaseOrders(prev => [...prev, orderWithId]);
    
    // Create notification for the station
    const stationNotification: Notification = {
      id: Date.now(),
      stationId: newOrder.stationId,
      title: "New Purchase Order Created",
      message: `New ${newOrder.productType} delivery of ${newOrder.totalVolume.toLocaleString()} liters expected.`,
      dateTime: new Date().toISOString(),
      read: false,
      type: "Order"
    };
    
    // Create notification for CEO
    const ceoNotification: Notification = {
      id: Date.now() + 1,
      stationId: 1, // CEO's station ID
      title: "New Purchase Order Pending",
      message: `${newOrder.stationName} has created a new ${newOrder.productType} purchase order.`,
      dateTime: new Date().toISOString(),
      read: false,
      type: "Order"
    };
    
    setNotifications(prev => [...prev, stationNotification, ceoNotification]);
    playNotificationSound();
  };

  const updatePurchaseOrder = (updatedOrder: PurchaseOrder) => {
    setPurchaseOrders(prev => 
      prev.map(order => 
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );

    // Create notification for the station about status change
    if (updatedOrder.status !== 'Pending') {
      const notification: Notification = {
        id: Date.now(),
        stationId: updatedOrder.stationId,
        title: "Purchase Order Status Updated",
        message: `Your purchase order for ${updatedOrder.productType} has been ${updatedOrder.status.toLowerCase()}.`,
        dateTime: new Date().toISOString(),
        read: false,
        type: "Order"
      };
      
      setNotifications(prev => [...prev, notification]);
      playNotificationSound();
    }
  };

  const createDriverOffload = (newOffload: Omit<DriverOffload, 'id'>) => {
    const offloadWithId = {
      ...newOffload,
      id: Date.now(),
    };
    
    setDriverOffloads(prev => [...prev, offloadWithId]);
    
    const newNotification: Notification = {
      id: Date.now(),
      stationId: 1,
      title: "New Driver Offload",
      message: `Driver ${newOffload.driverName} has offloaded ${newOffload.volumeArrived.toLocaleString()} liters.`,
      dateTime: new Date().toISOString(),
      read: false,
      type: "Offload"
    };
    
    setNotifications(prev => [...prev, newNotification]);
    playNotificationSound();
  };

  const createTankOffload = (newOffload: Omit<TankOffload, 'id'>) => {
    const offloadWithId = {
      ...newOffload,
      id: Date.now(),
    };
    
    setTankOffloads(prev => [...prev, offloadWithId]);
    
    const station = stations.find(s => s.tanks.some(t => t.id === newOffload.tankId));
    if (!station) return;
    
    const tank = station.tanks.find(t => t.id === newOffload.tankId);
    if (!tank) return;
    
    const updatedTank = {
      ...tank,
      currentVolume: newOffload.finalVolume,
      lastUpdated: new Date().toISOString(),
    };
    
    const updatedStation = {
      ...station,
      tanks: station.tanks.map(t => t.id === tank.id ? updatedTank : t),
    };
    
    updateStation(updatedStation);
    
    const newNotification: Notification = {
      id: Date.now(),
      stationId: station.id,
      title: "Tank Offload Complete",
      message: `Tank ${tank.name} has been offloaded. New volume: ${newOffload.finalVolume.toLocaleString()} liters.`,
      dateTime: new Date().toISOString(),
      read: false,
      type: "Tank"
    };
    
    setNotifications(prev => [...prev, newNotification]);
    playNotificationSound();
  };

  const createTank = (stationId: number, tankData: Omit<Tank, 'id' | 'stationId'>) => {
    const station = stations.find(s => s.id === stationId);
    if (!station) return;
    
    const newTank: Tank = {
      ...tankData,
      id: Date.now(),
      stationId,
      priceHistory: [],
    };
    
    const updatedStation = {
      ...station,
      tanks: [...station.tanks, newTank],
    };
    
    updateStation(updatedStation);
  };

  const updateTank = (updatedTank: Tank) => {
    const station = stations.find(s => s.id === updatedTank.stationId);
    if (!station) return;
    
    const updatedStation = {
      ...station,
      tanks: station.tanks.map(t => t.id === updatedTank.id ? updatedTank : t),
    };
    
    updateStation(updatedStation);
  };

  const deleteTank = (stationId: number, tankId: number) => {
    const station = stations.find(s => s.id === stationId);
    if (!station) return;
    
    const updatedStation = {
      ...station,
      tanks: station.tanks.filter(t => t.id !== tankId),
    };
    
    updateStation(updatedStation);
  };

  const getStationNotifications = (stationId: number) => {
    return notifications.filter(notification => notification.stationId === stationId);
  };

  const markNotificationAsRead = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const playClickSound = () => {
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.play().catch(error => {
        console.warn("Click sound playback failed:", error);
      });
    }
  };

  const playNotificationSound = () => {
    if (notificationSound) {
      notificationSound.currentTime = 0;
      notificationSound.play().catch(error => {
        console.warn("Notification sound playback failed:", error);
      });
    }
  };

  const getStation = (id: number) => {
    return stations.find(station => station.id === id);
  };

  return (
    <AppContext.Provider value={{
      stations,
      purchaseOrders,
      notifications,
      driverOffloads,
      tankOffloads,
      updateStation,
      createPurchaseOrder,
      updatePurchaseOrder,
      createDriverOffload,
      getStationNotifications,
      markNotificationAsRead,
      playClickSound,
      playNotificationSound,
      getStation,
      createTank,
      updateTank,
      deleteTank,
      createTankOffload,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};