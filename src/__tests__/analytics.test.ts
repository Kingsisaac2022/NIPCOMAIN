import { describe, it, expect, beforeEach } from 'vitest';
import AnalyticsService from '../services/AnalyticsService';
import CacheService from '../services/CacheService';

describe('AnalyticsService', () => {
  let analyticsService: AnalyticsService;
  let cacheService: CacheService;

  beforeEach(() => {
    analyticsService = AnalyticsService.getInstance();
    cacheService = CacheService.getInstance();
  });

  it('should be a singleton', () => {
    const instance1 = AnalyticsService.getInstance();
    const instance2 = AnalyticsService.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('should cache results', async () => {
    const mockData = { test: 'data' };
    await cacheService.set('test-key', mockData);
    const cached = await cacheService.get('test-key');
    expect(cached).toEqual(mockData);
  });
});