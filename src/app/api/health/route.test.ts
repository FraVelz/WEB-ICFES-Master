import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@/services/persistence/supabaseConfigured', () => ({
  isSupabaseConfigured: vi.fn(() => false),
}));

vi.mock('@/lib/monitoring/examSentry', () => ({
  isExamSentryConfigured: vi.fn(() => false),
}));

describe('GET /api/health', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns status ok with service metadata', async () => {
    const { GET } = await import('./route');
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('ok');
    expect(body.service).toBe('web-icfes-master');
    expect(typeof body.timestamp).toBe('string');
    expect(body.checks).toEqual({
      supabaseConfigured: false,
      examSentryConfigured: false,
    });
  });
});
