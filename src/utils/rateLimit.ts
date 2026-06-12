type RateLimitEntry = {
  count: number;
  resetAt: number;
};

/** En memoria por instancia serverless; fallback si no hay KV configurado. */
const buckets = new Map<string, RateLimitEntry>();

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

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
  const baseUrl = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!baseUrl || !token) return null;

  const redisKey = windowKey(key, windowMs);
  const ttlSeconds = Math.ceil(windowMs / 1000);

  try {
    const response = await fetch(`${baseUrl}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', redisKey],
        ['EXPIRE', redisKey, ttlSeconds],
      ]),
      cache: 'no-store',
    });

    if (!response.ok) return null;

    const results = (await response.json()) as { result: number | boolean }[];
    const count = typeof results[0]?.result === 'number' ? results[0].result : limit + 1;
    const resetAt = Date.now() + windowMs;

    if (count > limit) {
      return { allowed: false, remaining: 0, resetAt };
    }

    return { allowed: true, remaining: Math.max(0, limit - count), resetAt };
  } catch {
    return null;
  }
}

export async function checkRateLimit(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
  const distributed = await kvRateLimit(key, limit, windowMs);
  if (distributed) return distributed;
  return memoryRateLimit(key, limit, windowMs);
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? 'unknown';
  return request.headers.get('x-real-ip') ?? 'unknown';
}
