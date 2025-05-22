import localforage from 'localforage';

class CacheService {
  private static instance: CacheService;
  private cache: LocalForage;

  private constructor() {
    this.cache = localforage.createInstance({
      name: 'nipco-station-manager'
    });
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    const item = {
      value,
      timestamp: Date.now(),
      ttl: ttl * 1000 // Convert to milliseconds
    };
    await this.cache.setItem(key, item);
  }

  async get<T>(key: string): Promise<T | null> {
    const item = await this.cache.getItem<{
      value: T;
      timestamp: number;
      ttl: number;
    }>(key);

    if (!item) return null;

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      await this.cache.removeItem(key);
      return null;
    }

    return item.value;
  }

  async remove(key: string): Promise<void> {
    await this.cache.removeItem(key);
  }

  async clear(): Promise<void> {
    await this.cache.clear();
  }

  // Offline support methods
  async setOfflineQueue(operation: any): Promise<void> {
    const queue = await this.get<any[]>('offlineQueue') || [];
    queue.push({ ...operation, timestamp: Date.now() });
    await this.set('offlineQueue', queue);
  }

  async getOfflineQueue(): Promise<any[]> {
    return await this.get<any[]>('offlineQueue') || [];
  }

  async clearOfflineQueue(): Promise<void> {
    await this.remove('offlineQueue');
  }
}

export default CacheService;