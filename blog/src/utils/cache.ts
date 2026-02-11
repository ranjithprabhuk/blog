interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const CACHE_PREFIX = "blog_cache_";

export function getCached<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;

    const entry: CacheEntry<T> = JSON.parse(raw);
    const isExpired = Date.now() - entry.timestamp > entry.ttl;

    if (isExpired) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }

    return entry.data;
  } catch {
    return null;
  }
}

export function setCache<T>(key: string, data: T, ttl: number): void {
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now(), ttl };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch {
    // Storage full or unavailable — silently fail
  }
}

export function clearCache(): void {
  const keys = Object.keys(localStorage).filter((k) =>
    k.startsWith(CACHE_PREFIX),
  );
  keys.forEach((k) => localStorage.removeItem(k));
}
