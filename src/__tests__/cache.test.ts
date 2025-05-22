import { describe, it, expect, beforeEach } from 'vitest';
import CacheService from '../services/CacheService';

describe('CacheService', () => {
  let cacheService: CacheService;

  beforeEach(async () => {
    cacheService = CacheService.getInstance();
    await cacheService.clear();
  });

  it('should store and retrieve values', async () => {
    const testData = { foo: 'bar' };
    await cacheService.set('test', testData);
    const retrieved = await cacheService.get('test');
    expect(retrieved).toEqual(testData);
  });

  it('should respect TTL', async () => {
    const testData = { foo: 'bar' };
    await cacheService.set('test', testData, 0); // Expire immediately
    const retrieved = await cacheService.get('test');
    expect(retrieved).toBeNull();
  });

  it('should clear all values', async () => {
    await cacheService.set('test1', 'value1');
    await cacheService.set('test2', 'value2');
    await cacheService.clear();
    const val1 = await cacheService.get('test1');
    const val2 = await cacheService.get('test2');
    expect(val1).toBeNull();
    expect(val2).toBeNull();
  });
});