import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from './route';
import { CHAT_AUTH_COOKIE, CHAT_AUTH_DAILY_LIMIT } from '@/features/learning/constants/chatQuota';

describe('/api/chat', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key';
    process.env.OPENAI_ENABLED = 'true';
    process.env.OPENAI_API_KEY = 'sk-test';
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe('GET', () => {
    it('returns 503 when OpenAI is disabled', async () => {
      delete process.env.OPENAI_ENABLED;
      delete process.env.NEXT_PUBLIC_OPENAI_ENABLED;

      const request = new NextRequest('http://localhost/api/chat');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.enabled).toBe(false);
    });

    it('requires authentication for chat usage', async () => {
      const request = new NextRequest('http://localhost/api/chat');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.enabled).toBe(true);
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

  describe('POST', () => {
    it('returns 503 with OPENAI_DISABLED when the flag is off', async () => {
      delete process.env.OPENAI_ENABLED;
      delete process.env.NEXT_PUBLIC_OPENAI_ENABLED;

      const request = new NextRequest('http://localhost/api/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: [{ role: 'user', content: 'hola' }] }),
        headers: { 'Content-Type': 'application/json' },
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.code).toBe('OPENAI_DISABLED');
    });
  });
});
