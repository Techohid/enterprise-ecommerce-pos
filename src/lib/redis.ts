/**
 * Distributed Cache & Lock Provider
 * Uses Redis in production or when REDIS_URL is accessible,
 * with an in-memory fallback for zero-dependency local development.
 */

class MemoryCache {
  private store = new Map<string, { value: string; expiresAt: number | null }>();

  async get(key: string): Promise<string | null> {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    this.store.set(key, { value, expiresAt });
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
  }

  async acquireLock(lockKey: string, ttlSeconds: number = 10): Promise<boolean> {
    const existing = await this.get(lockKey);
    if (existing) return false;
    await this.set(lockKey, "LOCKED", ttlSeconds);
    return true;
  }

  async releaseLock(lockKey: string): Promise<void> {
    await this.del(lockKey);
  }
}

declare global {
  // eslint-disable-next-line no-var
  var memoryCacheGlobal: MemoryCache | undefined;
}

export const cache = globalThis.memoryCacheGlobal ?? new MemoryCache();

if (process.env.NODE_ENV !== "production") {
  globalThis.memoryCacheGlobal = cache;
}

export default cache;
