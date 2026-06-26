import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getAuthChatUsage, incrementAuthChatUsage } from './chatQuotaServer';

describe('chatQuotaServer', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    delete process.env.KV_REST_API_URL;
    delete process.env.KV_REST_API_TOKEN;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('uses cookie fallback when KV is not configured', async () => {
    await expect(getAuthChatUsage('user-1', 3)).resolves.toBe(3);
    await expect(incrementAuthChatUsage('user-1', 3)).resolves.toBe(4);
  });
});
