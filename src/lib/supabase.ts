import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const signIn = async (password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'station@example.com',
    password
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Real-time subscription helpers
export const subscribeToSales = (stationId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('sales_channel')
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
};

export const subscribeToTankVolumes = (stationId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('tanks_channel')
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
};