import { afterEach, describe, expect, it, vi } from 'vitest';

import { isPlausibleExamElapsed, MIN_MS_PER_QUESTION_FOR_XP, signExamTimer, verifyExamTimer } from './examTimerToken';

describe('examTimerToken', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('signs and verifies a server-anchored timer payload', () => {
    const startedAt = 1_700_000_000_000;
    const endsAt = startedAt + 120_000;
    const token = signExamTimer({
      startedAt,
      endsAt,
      questionCount: 5,
      attemptType: 'practice',
    });

    const payload = verifyExamTimer(token);
    expect(payload).not.toBeNull();
    expect(payload?.startedAt).toBe(startedAt);
    expect(payload?.endsAt).toBe(endsAt);
    expect(payload?.questionCount).toBe(5);
    expect(payload?.attemptType).toBe('practice');
  });

  it('rejects tampered tokens', () => {
    const token = signExamTimer({
      startedAt: 1_700_000_000_000,
      endsAt: 1_700_000_120_000,
      questionCount: 3,
      attemptType: 'full-exam',
    });
    const [encoded] = token.split('.');
    expect(verifyExamTimer(`${encoded}.deadbeef`)).toBeNull();
  });

  it('requires min elapsed ms per question for XP plausibility', () => {
    const startedAt = 1_700_000_000_000;
    const questionCount = 4;
    const minMs = questionCount * MIN_MS_PER_QUESTION_FOR_XP;

    expect(isPlausibleExamElapsed(startedAt, questionCount, startedAt + minMs - 1)).toBe(false);
    expect(isPlausibleExamElapsed(startedAt, questionCount, startedAt + minMs)).toBe(true);
  });

  it('rejects future startedAt', () => {
    const now = 1_700_000_000_000;
    expect(isPlausibleExamElapsed(now + 60_000, 2, now)).toBe(false);
  });
});
