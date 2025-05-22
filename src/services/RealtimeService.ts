import { supabase } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

class RealtimeService {
  private static instance: RealtimeService;
  private channels: Map<string, RealtimeChannel> = new Map();

  private constructor() {}

  static getInstance(): RealtimeService {
    if (!RealtimeService.instance) {
      RealtimeService.instance = new RealtimeService();
    }
    return RealtimeService.instance;
  }

  subscribeToTankUpdates(stationId: string, callback: (payload: any) => void) {
    const channelId = `tanks:${stationId}`;
    
    if (this.channels.has(channelId)) {
      return;
    }

    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tanks',
          filter: `station_id=eq.${stationId}`
        },
        callback
      )
      .subscribe();

    this.channels.set(channelId, channel);
  }

  subscribeToSalesUpdates(stationId: string, callback: (payload: any) => void) {
    const channelId = `sales:${stationId}`;
    
    if (this.channels.has(channelId)) {
      return;
    }

    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sales',
          filter: `station_id=eq.${stationId}`
        },
        callback
      )
      .subscribe();

    this.channels.set(channelId, channel);
  }

  unsubscribeAll() {
    this.channels.forEach(channel => {
      channel.unsubscribe();
    });
    this.channels.clear();
  }
}

export default RealtimeService;