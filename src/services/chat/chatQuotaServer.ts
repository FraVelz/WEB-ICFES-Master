import { kvGetInt, kvIncr, isKvConfigured } from '@/utils/kvRest';

const DAY_TTL_SECONDS = 60 * 60 * 25;

function utcDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function usageKey(userId: string): string {
  return `chat:usage:${userId}:${utcDateKey()}`;
}

export function isDistributedChatQuotaEnabled(): boolean {
  return isKvConfigured();
}

/** Server-side daily chat usage. Falls back to cookie value when KV is not configured. */
export async function getAuthChatUsage(userId: string, cookieUsed: number): Promise<number> {
  if (!isKvConfigured()) return cookieUsed;
  const kvUsed = await kvGetInt(usageKey(userId));
  return kvUsed ?? cookieUsed;
}

/** Increments server-side usage and returns the new count. */
export async function incrementAuthChatUsage(userId: string, cookieUsed: number): Promise<number> {
  if (!isKvConfigured()) return cookieUsed + 1;
  const next = await kvIncr(usageKey(userId), DAY_TTL_SECONDS);
  return next ?? cookieUsed + 1;
}
