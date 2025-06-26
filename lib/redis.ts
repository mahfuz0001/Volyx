import { config } from './config';

// Redis client for rate limiting and caching
class RedisClient {
  private client: any = null;
  private isConnected = false;

  async connect() {
    if (this.isConnected) return;

    try {
      // In a real implementation, you'd use a Redis client like ioredis
      // For now, we'll use a Map as a fallback for development
      if (config.app.isDev) {
        this.client = new Map();
        this.isConnected = true;
        console.log('Using in-memory cache for development');
        return;
      }

      // Production Redis connection would go here
      // const Redis = require('ioredis');
      // this.client = new Redis(config.redis.url);
      
      this.isConnected = true;
    } catch (error) {
      console.error('Redis connection failed:', error);
      // Fallback to in-memory storage
      this.client = new Map();
      this.isConnected = true;
    }
  }

  async get(key: string): Promise<string | null> {
    await this.connect();
    
    if (this.client instanceof Map) {
      const item = this.client.get(key);
      if (item && item.expiry > Date.now()) {
        return item.value;
      }
      if (item) {
        this.client.delete(key);
      }
      return null;
    }
    
    // Real Redis implementation
    return this.client?.get(key) || null;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    await this.connect();
    
    if (this.client instanceof Map) {
      const expiry = ttlSeconds ? Date.now() + (ttlSeconds * 1000) : Infinity;
      this.client.set(key, { value, expiry });
      return;
    }
    
    // Real Redis implementation
    if (ttlSeconds) {
      await this.client?.setex(key, ttlSeconds, value);
    } else {
      await this.client?.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.connect();
    
    if (this.client instanceof Map) {
      this.client.delete(key);
      return;
    }
    
    await this.client?.del(key);
  }

  async incr(key: string): Promise<number> {
    await this.connect();
    
    if (this.client instanceof Map) {
      const current = this.client.get(key);
      const newValue = (current?.value || 0) + 1;
      this.client.set(key, { value: newValue, expiry: current?.expiry || Infinity });
      return newValue;
    }
    
    return this.client?.incr(key) || 0;
  }

  async expire(key: string, seconds: number): Promise<void> {
    await this.connect();
    
    if (this.client instanceof Map) {
      const item = this.client.get(key);
      if (item) {
        item.expiry = Date.now() + (seconds * 1000);
      }
      return;
    }
    
    await this.client?.expire(key, seconds);
  }
}

export const redis = new RedisClient();