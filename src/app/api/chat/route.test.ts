import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from './route';
import { CHAT_AUTH_COOKIE, CHAT_AUTH_DAILY_LIMIT } from '@/features/learning/constants/chatQuota';

describe('GET /api/chat', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key';
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('requires authentication for chat usage', async () => {
    const request = new NextRequest('http://localhost/api/chat');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.requiresAuth).toBe(true);
    expect(data.limit).toBe(0);
    expect(data.authUsed).toBe(0);
    expect(data.unlimited).toBe(false);
  });

  it('reads authenticated usage from the httpOnly cookie when JWT is absent', async () => {
    const request = new NextRequest('http://localhost/api/chat');
    request.cookies.set(CHAT_AUTH_COOKIE, '2');

    const response = await GET(request);
    const data = await response.json();

    expect(data.requiresAuth).toBe(true);
    expect(data.limit).toBe(0);
  });

  it('requires auth when Supabase env is missing and there is no JWT', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const request = new NextRequest('http://localhost/api/chat');
    const response = await GET(request);
    const data = await response.json();

    expect(data.requiresAuth).toBe(true);
    expect(data.limit).toBe(0);
    expect(data.authUsed).toBe(0);
    expect(data.unlimited).toBe(false);
    expect(CHAT_AUTH_DAILY_LIMIT).toBeGreaterThan(0);
  });
});
