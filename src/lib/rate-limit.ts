interface RateLimitEntry {
  timestamps: number[];
  windowMs: number;
}

const store = new Map<string, RateLimitEntry>();
const DEFAULT_WINDOW_MS = 60_000;
const DEFAULT_MAX_REQUESTS = 10;

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < entry.windowMs);
    if (entry.timestamps.length === 0) store.delete(key);
  }
}, DEFAULT_WINDOW_MS);

interface RateLimitOptions {
  maxRequests?: number;
  namespace?: string;
  windowMs?: number;
}

export function rateLimit(identifier: string, options: RateLimitOptions = {}): {
  success: boolean;
  remaining: number;
  resetAt: number;
} {
  const maxRequests = options.maxRequests ?? DEFAULT_MAX_REQUESTS;
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS;
  const key = `${options.namespace ?? "default"}:${identifier}`;
  const now = Date.now();
  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [], windowMs };
    store.set(key, entry);
  }

  entry.windowMs = windowMs;
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

  if (entry.timestamps.length >= maxRequests) {
    const oldest = entry.timestamps[0];
    const resetAt = oldest + windowMs;
    return { success: false, remaining: 0, resetAt };
  }

  entry.timestamps.push(now);
  return {
    success: true,
    remaining: maxRequests - entry.timestamps.length,
    resetAt: now + windowMs,
  };
}
