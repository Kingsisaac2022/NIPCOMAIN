import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import CacheService from './CacheService';

class AnalyticsService {
  private static instance: AnalyticsService;
  private cache: CacheService;

  private constructor() {
    this.cache = CacheService.getInstance();
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  async getDailySales(stationId: string, startDate: Date, endDate: Date) {
    const cacheKey = `daily-sales-${stationId}-${format(startDate, 'yyyy-MM-dd')}-${format(endDate, 'yyyy-MM-dd')}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .eq('station_id', stationId)
      .gte('date', format(startDate, 'yyyy-MM-dd'))
      .lte('date', format(endDate, 'yyyy-MM-dd'));

    if (error) throw error;

    await this.cache.set(cacheKey, data, 3600); // Cache for 1 hour
    return data;
  }

  async getTankVolumeTrends(stationId: string, days: number = 7) {
    const cacheKey = `tank-trends-${stationId}-${days}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase
      .from('tanks')
      .select('*')
      .eq('station_id', stationId)
      .order('last_updated', { ascending: false });

    if (error) throw error;

    await this.cache.set(cacheKey, data, 1800); // Cache for 30 minutes
    return data;
  }

  async getStaffPerformance(stationId: string, startDate: Date, endDate: Date) {
    const cacheKey = `staff-performance-${stationId}-${format(startDate, 'yyyy-MM-dd')}-${format(endDate, 'yyyy-MM-dd')}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        staff:staff_id (
          name,
          role
        )
      `)
      .eq('station_id', stationId)
      .gte('date', format(startDate, 'yyyy-MM-dd'))
      .lte('date', format(endDate, 'yyyy-MM-dd'));

    if (error) throw error;

    const performance = this.calculateStaffPerformance(data);
    await this.cache.set(cacheKey, performance, 3600);
    return performance;
  }

  private calculateStaffPerformance(sales: any[]) {
    return sales.reduce((acc, sale) => {
      const staffId = sale.staff_id;
      if (!acc[staffId]) {
        acc[staffId] = {
          name: sale.staff.name,
          role: sale.staff.role,
          totalSales: 0,
          totalVolume: 0,
          transactions: 0
        };
      }

      acc[staffId].totalSales += sale.revenue;
      acc[staffId].totalVolume += sale.volume_sold;
      acc[staffId].transactions += 1;

      return acc;
    }, {});
  }
}

export default AnalyticsService;