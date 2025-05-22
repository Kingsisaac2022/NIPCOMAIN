import { Station, PurchaseOrder, Notification, DriverOffload, TankOffload, SalesEntry, Expense } from '../types';

type DataEvent = {
  type: 'station' | 'order' | 'notification' | 'offload' | 'sales' | 'expense';
  action: 'create' | 'update' | 'delete';
  timestamp: string;
  data: any;
};

class DataTracker {
  private static instance: DataTracker;
  private eventLog: DataEvent[] = [];
  private subscribers: ((event: DataEvent) => void)[] = [];

  private constructor() {}

  static getInstance(): DataTracker {
    if (!DataTracker.instance) {
      DataTracker.instance = new DataTracker();
    }
    return DataTracker.instance;
  }

  trackEvent(event: DataEvent) {
    this.eventLog.push(event);
    this.notifySubscribers(event);
    this.persistToLocalStorage();
  }

  getEventLog(): DataEvent[] {
    return this.eventLog;
  }

  subscribe(callback: (event: DataEvent) => void) {
    this.subscribers.push(callback);
  }

  private notifySubscribers(event: DataEvent) {
    this.subscribers.forEach(callback => callback(event));
  }

  private persistToLocalStorage() {
    try {
      localStorage.setItem('eventLog', JSON.stringify(this.eventLog));
    } catch (error) {
      console.error('Error persisting event log:', error);
    }
  }

  loadFromLocalStorage() {
    try {
      const stored = localStorage.getItem('eventLog');
      if (stored) {
        this.eventLog = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading event log:', error);
    }
  }
}

export default DataTracker;