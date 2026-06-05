import { describe, expect, it, beforeEach, vi } from 'vitest';

import {
  calculateCurrentStreak,
  calculateLongestStreak,
  getLocalDateString,
  mergeStreakStates,
  normalizeStreakDates,
} from './streakUtils';
import { DEMO_STREAK_KEY, getUserStreakKey } from './streakTypes';
import { loadLocalStreakState, saveLocalStreakState } from './streakLocalStorage';
import { mergeDemoStreakIntoUser, recordStreakToday } from './streakService';

function createStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
    removeItem: (key: string) => {
      map.delete(key);
    },
    key: (index: number) => [...map.keys()][index] ?? null,
  } as Storage;
}

describe('streakUtils', () => {
  it('calculateCurrentStreak returns 0 when last activity is older than yesterday', () => {
    const old = getLocalDateString(new Date(Date.now() - 3 * 86400000));
    expect(calculateCurrentStreak([old])).toBe(0);
  });

  it('calculateCurrentStreak counts consecutive days including today', () => {
    const today = getLocalDateString();
    const yesterday = getLocalDateString(new Date(Date.now() - 86400000));
    expect(calculateCurrentStreak([today, yesterday])).toBe(2);
  });

  it('calculateLongestStreak finds max consecutive run', () => {
    expect(calculateLongestStreak(['2026-06-01', '2026-06-02', '2026-06-03', '2026-06-10'])).toBe(3);
  });

  it('mergeStreakStates unions dates and longest', () => {
    const merged = mergeStreakStates(
      { dates: ['2026-06-01'], longestStreak: 2 },
      { dates: ['2026-06-02'], longestStreak: 5 }
    );
    expect(normalizeStreakDates(merged.dates)).toEqual(['2026-06-01', '2026-06-02']);
    expect(merged.longestStreak).toBeGreaterThanOrEqual(2);
  });
});

describe('streakService local', () => {
  beforeEach(() => {
    const storage = createStorage();
    vi.stubGlobal('localStorage', storage);
    vi.stubGlobal('window', {
      dispatchEvent: vi.fn(),
      localStorage: storage,
    });
  });

  it('recordStreakToday is idempotent for the same day', async () => {
    const first = await recordStreakToday('demo');
    const second = await recordStreakToday('demo');
    expect(first.dates).toHaveLength(1);
    expect(second.dates).toHaveLength(1);
    expect(calculateCurrentStreak(second.dates)).toBe(1);
  });

  it('mergeDemoStreakIntoUser merges demo into user and clears demo key', async () => {
    saveLocalStreakState('demo', { dates: ['2026-06-01', '2026-06-02'], longestStreak: 2 });
    saveLocalStreakState('user-abc', { dates: ['2026-06-03'], longestStreak: 1 });

    const merged = await mergeDemoStreakIntoUser('user-abc');

    expect(merged.dates).toEqual(['2026-06-01', '2026-06-02', '2026-06-03']);
    expect(loadLocalStreakState('demo').dates).toHaveLength(0);
    expect(loadLocalStreakState('user-abc').dates).toHaveLength(3);
    expect(localStorage.getItem(DEMO_STREAK_KEY)).toBeNull();
    expect(localStorage.getItem(getUserStreakKey('user-abc'))).toBeTruthy();
  });
});
