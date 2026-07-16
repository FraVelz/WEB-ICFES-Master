import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  clearPracticeSession,
  computeTimeRemainingFromEndsAt,
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
});
