class RateLimiter {
  private static instance: RateLimiter;
  private limits: Map<string, { count: number; timestamp: number }>;
  private maxRequests: number;
  private timeWindow: number;

  private constructor() {
    this.limits = new Map();
    this.maxRequests = 100; // Requests per window
    this.timeWindow = 60000; // 1 minute in milliseconds
  }

  static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const limit = this.limits.get(key);

    if (!limit) {
      this.limits.set(key, { count: 1, timestamp: now });
      return true;
    }

    if (now - limit.timestamp > this.timeWindow) {
      this.limits.set(key, { count: 1, timestamp: now });
      return true;
    }

    if (limit.count >= this.maxRequests) {
      return false;
    }

    limit.count++;
    return true;
  }

  reset(key: string): void {
    this.limits.delete(key);
  }
}

export default RateLimiter;