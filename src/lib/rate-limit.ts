import { createHash } from "node:crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

interface RateLimitEntry {
  timestamps: number[];
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

interface RateLimitOptions {
  maxRequests?: number;
  namespace?: string;
  windowMs?: number;
}

const store = new Map<string, RateLimitEntry>();
const distributedLimiters = new Map<string, Ratelimit>();
const upstashConfigured = Boolean(
  process.env.UPSTASH_REDIS_REST_URL?.trim() &&
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim(),
);
const redis = upstashConfigured ? Redis.fromEnv() : null;

function positiveInteger(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

const DEFAULT_WINDOW_MS =
  positiveInteger(process.env.RATE_LIMIT_WINDOW_SECONDS, 60) * 1_000;
const DEFAULT_MAX_REQUESTS = positiveInteger(
  process.env.RATE_LIMIT_MAX_REQUESTS,
  10,
);

function localRateLimit(
  identifier: string,
  namespace: string,
  maxRequests: number,
  windowMs: number,
): RateLimitResult {
  const key = `${namespace}:${identifier}`;
  const now = Date.now();
  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [], windowMs };
    store.set(key, entry);
  }

  entry.windowMs = windowMs;
  entry.timestamps = entry.timestamps.filter((timestamp) => now - timestamp < windowMs);

  if (entry.timestamps.length >= maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetAt: entry.timestamps[0] + windowMs,
    };
  }

  entry.timestamps.push(now);

  // Keep long-running local processes bounded without a background timer.
  if (store.size > 10_000) {
    for (const [storedKey, storedEntry] of store) {
      if (storedEntry.timestamps.every((timestamp) => now - timestamp >= storedEntry.windowMs)) {
        store.delete(storedKey);
      }
    }
  }

  return {
    success: true,
    remaining: maxRequests - entry.timestamps.length,
    resetAt: now + windowMs,
  };
}

function getDistributedLimiter(
  namespace: string,
  maxRequests: number,
  windowMs: number,
): Ratelimit | null {
  if (!redis) return null;
  const key = `${namespace}:${maxRequests}:${windowMs}`;
  const existing = distributedLimiters.get(key);
  if (existing) return existing;

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(
      maxRequests,
      `${windowMs} ms` as `${number} ms`,
    ),
    analytics: false,
    prefix: `scopeseal:${namespace}`,
  });
  distributedLimiters.set(key, limiter);
  return limiter;
}

export async function rateLimit(
  identifier: string,
  options: RateLimitOptions = {},
): Promise<RateLimitResult> {
  const maxRequests = options.maxRequests ?? DEFAULT_MAX_REQUESTS;
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS;
  const namespace = options.namespace ?? "default";
  const identifierHash = createHash("sha256").update(identifier).digest("hex");
  const distributed = getDistributedLimiter(namespace, maxRequests, windowMs);

  if (distributed) {
    try {
      const result = await distributed.limit(identifierHash);
      return {
        success: result.success,
        remaining: result.remaining,
        resetAt: result.reset,
      };
    } catch {
      // Preserve availability during a Redis outage while retaining per-instance protection.
    }
  }

  return localRateLimit(identifierHash, namespace, maxRequests, windowMs);
}
