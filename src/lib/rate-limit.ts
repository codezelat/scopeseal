interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);
    if (entry.timestamps.length === 0) store.delete(key);
  }
}, WINDOW_MS);

export function rateLimit(ip: string): {
  success: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  let entry = store.get(ip);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(ip, entry);
  }

  entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);

  if (entry.timestamps.length >= MAX_REQUESTS) {
    const oldest = entry.timestamps[0];
    const resetAt = oldest + WINDOW_MS;
    return { success: false, remaining: 0, resetAt };
  }

  entry.timestamps.push(now);
  return {
    success: true,
    remaining: MAX_REQUESTS - entry.timestamps.length,
    resetAt: now + WINDOW_MS,
  };
}
