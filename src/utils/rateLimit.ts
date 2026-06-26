import { isKvConfigured, kvIncr } from '@/utils/kvRest';

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

/** En memoria por instancia serverless; fallback si no hay KV configurado. */
const buckets = new Map<string, RateLimitEntry>();

let memoryFallbackWarned = false;

function warnMemoryFallbackOnce(): void {
  if (memoryFallbackWarned || process.env.NODE_ENV !== 'production') return;
  memoryFallbackWarned = true;
  console.warn(
    '[rateLimit] KV_REST_API_URL / KV_REST_API_TOKEN not configured. ' +
      'API rate limits are per serverless instance, not global. ' +
      'Set Upstash/Vercel KV in production — see docs/es/setup/configuration.md'
  );
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

export { isKvConfigured as isDistributedRateLimitEnabled };

function memoryRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now >= entry.resetAt) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  buckets.set(key, entry);
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

function windowKey(key: string, windowMs: number): string {
  const windowId = Math.floor(Date.now() / windowMs);
  return `ratelimit:${key}:${windowId}`;
}

async function kvRateLimit(key: string, limit: number, windowMs: number): Promise<RateLimitResult | null> {
  if (!isKvConfigured()) return null;

  const redisKey = windowKey(key, windowMs);
  const ttlSeconds = Math.ceil(windowMs / 1000);
  const count = await kvIncr(redisKey, ttlSeconds);
  if (count === null) return null;

  const resetAt = Date.now() + windowMs;

  if (count > limit) {
    return { allowed: false, remaining: 0, resetAt };
  }

  return { allowed: true, remaining: Math.max(0, limit - count), resetAt };
}

export async function checkRateLimit(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
  const distributed = await kvRateLimit(key, limit, windowMs);
  if (distributed) return distributed;
  warnMemoryFallbackOnce();
  return memoryRateLimit(key, limit, windowMs);
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? 'unknown';
  return request.headers.get('x-real-ip') ?? 'unknown';
}
