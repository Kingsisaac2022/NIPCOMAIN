import { useEffect } from 'react';
import RealtimeService from '../services/RealtimeService';
import { useAppContext } from '../context/AppContext';

export const useRealtime = (stationId: string) => {
  const { updateStation } = useAppContext();
  const realtimeService = RealtimeService.getInstance();

  useEffect(() => {
    // Subscribe to tank updates
    realtimeService.subscribeToTankUpdates(stationId, (payload) => {
      const { new: newTank } = payload;
      if (newTank) {
        updateStation(prevStation => ({
          ...prevStation,
          tanks: prevStation.tanks.map(tank => 
            tank.id === newTank.id ? newTank : tank
          )
        }));
      }
    });

    // Subscribe to sales updates
    realtimeService.subscribeToSalesUpdates(stationId, (payload) => {
      const { new: newSale } = payload;
      if (newSale) {
        updateStation(prevStation => ({
          ...prevStation,
          sales: [...prevStation.sales, newSale]
        }));
      }
    });

    return () => {
      realtimeService.unsubscribeAll();
    };
  }, [stationId]);
};