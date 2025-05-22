import CacheService from './CacheService';
import { supabase } from '../lib/supabase';

class SyncService {
  private static instance: SyncService;
  private cache: CacheService;

  private constructor() {
    this.cache = CacheService.getInstance();
  }

  static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  async syncOfflineData() {
    const queue = await this.cache.getOfflineQueue();
    if (!queue.length) return;

    for (const operation of queue) {
      try {
        await this.processOperation(operation);
      } catch (error) {
        console.error('Error syncing operation:', error);
        // Keep failed operations in queue
        continue;
      }
    }

    await this.cache.clearOfflineQueue();
  }

  private async processOperation(operation: any) {
    const { type, table, data } = operation;

    switch (type) {
      case 'insert':
        await supabase.from(table).insert(data);
        break;
      case 'update':
        await supabase.from(table).update(data.changes).eq('id', data.id);
        break;
      case 'delete':
        await supabase.from(table).delete().eq('id', data.id);
        break;
      default:
        throw new Error(`Unknown operation type: ${type}`);
    }
  }
}

export default SyncService;