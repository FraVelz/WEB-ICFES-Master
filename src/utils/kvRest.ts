type KvPipelineResult = { result: number | boolean | string | null };

/** True when Upstash/Vercel KV REST credentials are configured. */
export function isKvConfigured(): boolean {
  return Boolean(process.env.KV_REST_API_URL?.trim() && process.env.KV_REST_API_TOKEN?.trim());
}

async function kvPipeline(commands: unknown[][]): Promise<KvPipelineResult[] | null> {
  const baseUrl = process.env.KV_REST_API_URL?.trim();
  const token = process.env.KV_REST_API_TOKEN?.trim();
  if (!baseUrl || !token) return null;

  try {
    const response = await fetch(`${baseUrl}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commands),
      cache: 'no-store',
    });

    if (!response.ok) return null;
    return (await response.json()) as KvPipelineResult[];
  } catch {
    return null;
  }
}

/** Increments a key and sets TTL. Returns the new count or null when KV is unavailable. */
export async function kvIncr(key: string, ttlSeconds: number): Promise<number | null> {
  const results = await kvPipeline([
    ['INCR', key],
    ['EXPIRE', key, ttlSeconds],
  ]);
  const count = results?.[0]?.result;
  return typeof count === 'number' ? count : null;
}

/** Reads an integer counter. Returns 0 when the key is missing or KV is unavailable. */
export async function kvGetInt(key: string): Promise<number | null> {
  const results = await kvPipeline([['GET', key]]);
  const raw = results?.[0]?.result;
  if (raw === null || raw === undefined) return 0;
  if (typeof raw === 'number') return raw;
  if (typeof raw === 'string') {
    const parsed = Number.parseInt(raw, 10);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  }
  return null;
}
