type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

const ONE_HOUR_MS = 60 * 60 * 1000;
const store = new Map<string, CacheEntry<unknown>>();

export function getCache<T>(key: string): T | null {
  const entry = store.get(key);

  if (!entry) {
    return null;
  }

  const isExpired = Date.now() - entry.timestamp > ONE_HOUR_MS;

  if (isExpired) {
    store.delete(key);
    return null;
  }

  return entry.data as T;
}

export function setCache<T>(key: string, data: T): void {
  store.set(key, { data, timestamp: Date.now() });
}
