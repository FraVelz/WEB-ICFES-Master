import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  clearPracticeSession,
  computeTimeRemainingFromEndsAt,
  hydratePracticeSessionFromStorage,
  loadPracticeSession,
  practiceSessionStorageKey,
  savePracticeSession,
  type PracticeSessionSnapshot,
} from './practiceSessionStorage';

describe('practiceSessionStorage', () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    storage.clear();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storage.set(key, value);
      },
      removeItem: (key: string) => {
        storage.delete(key);
      },
      clear: () => storage.clear(),
      get length() {
        return storage.size;
      },
      key: (index: number) => [...storage.keys()][index] ?? null,
    });
  });

  const baseSnapshot = {
    state: 'in_progress' as const,
    areaSlug: 'matematicas',
    difficulty: null as const,
    examConfig: { numQuestions: 2, useTimer: true, timePerQuestion: 2 },
    questions: [
      { id: 'q1', text: 'Uno', options: [{ id: 'a', text: 'A' }] },
      { id: 'q2', text: 'Dos', options: [{ id: 'a', text: 'A' }] },
    ],
    answers: { q1: 'a' },
    timerEndsAt: Date.now() + 120_000,
  };

  it('persists and restores an in_progress session', () => {
    savePracticeSession(baseSnapshot);

    const loaded = loadPracticeSession('matematicas', null);
    expect(loaded).not.toBeNull();
    expect(loaded?.state).toBe('in_progress');
    expect(loaded?.answers).toEqual({ q1: 'a' });
    expect(loaded?.questions).toHaveLength(2);
    expect(loaded?.examConfig.numQuestions).toBe(2);
  });

  it('restores answers and timer after simulated reload', () => {
    const now = 1_700_000_000_000;
    const timerEndsAt = now + 120_000;

    // In-memory session (as React state would hold mid-practice).
    let memory: {
      answers: Record<string, string>;
      timerEndsAt: number | null;
      questions: typeof baseSnapshot.questions;
    } | null = {
      answers: { q1: 'a', q2: 'a' },
      timerEndsAt,
      questions: baseSnapshot.questions,
    };

    savePracticeSession({
      ...baseSnapshot,
      answers: memory.answers,
      timerEndsAt: memory.timerEndsAt,
    });

    // Simulated browser reload: drop in-memory state; durable storage remains.
    memory = null;

    const restored = hydratePracticeSessionFromStorage('matematicas', null, now);
    expect(memory).toBeNull();
    expect(restored).not.toBeNull();
    expect(restored?.answers).toEqual({ q1: 'a', q2: 'a' });
    expect(restored?.questions).toHaveLength(2);
    expect(restored?.timerEndsAt).toBe(timerEndsAt);
    expect(restored?.timeRemaining).toBe(120);
    expect(restored?.state).toBe('in_progress');
  });

  it('uses distinct keys per area and difficulty', () => {
    expect(practiceSessionStorageKey('lectura', null)).toBe('icfes_practice_session_v1:lectura:all');
    expect(practiceSessionStorageKey('lectura', 'básico')).toBe('icfes_practice_session_v1:lectura:básico');
  });

  it('clears session so refresh finds nothing', () => {
    savePracticeSession(baseSnapshot);
    clearPracticeSession('matematicas', null);
    expect(loadPracticeSession('matematicas', null)).toBeNull();
  });

  it('rejects invalid snapshots', () => {
    storage.set(
      practiceSessionStorageKey('matematicas', null),
      JSON.stringify({ version: 1, state: 'in_progress', areaSlug: 'matematicas' } satisfies Partial<PracticeSessionSnapshot>)
    );
    expect(loadPracticeSession('matematicas', null)).toBeNull();
  });

  it('computeTimeRemainingFromEndsAt clamps to zero', () => {
    expect(computeTimeRemainingFromEndsAt(null)).toBeNull();
    expect(computeTimeRemainingFromEndsAt(1_000, 2_000)).toBe(0);
    expect(computeTimeRemainingFromEndsAt(5_000, 2_000)).toBe(3);
  });

  it('derives remaining from fixed endsAt as wall clock advances (no counter drift)', () => {
    const startedAt = 1_700_000_000_000;
    const endsAt = startedAt + 60_000; // absolute anchor set once at start
    expect(computeTimeRemainingFromEndsAt(endsAt, startedAt)).toBe(60);
    expect(computeTimeRemainingFromEndsAt(endsAt, startedAt + 15_000)).toBe(45);
    expect(computeTimeRemainingFromEndsAt(endsAt, startedAt + 60_000)).toBe(0);
  });
});
