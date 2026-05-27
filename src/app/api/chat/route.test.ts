import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from './route';
import { CHAT_ANON_COOKIE, CHAT_ANON_LIMIT } from '@/features/learning/constants/chatAnonQuota';

describe('GET /api/chat', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key';
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('returns anonymous quota for unauthenticated requests', async () => {
    const request = new NextRequest('http://localhost/api/chat');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.limit).toBe(CHAT_ANON_LIMIT);
    expect(data.anonUsed).toBe(0);
    expect(data.unlimited).toBe(false);
  });

  it('reads anonymous usage from the httpOnly cookie', async () => {
    const request = new NextRequest('http://localhost/api/chat');
    request.cookies.set(CHAT_ANON_COOKIE, '2');

    const response = await GET(request);
    const data = await response.json();

    expect(data.anonUsed).toBe(2);
    expect(data.unlimited).toBe(false);
  });

  it('treats chat as unlimited when Supabase auth is not configured', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const request = new NextRequest('http://localhost/api/chat');
    const response = await GET(request);
    const data = await response.json();

    expect(data.unlimited).toBe(true);
    expect(data.anonUsed).toBe(0);
  });
});
