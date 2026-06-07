import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DEMO_USER_ID } from '@/services/demo/demoCoins';
import {
  readAchievementProgress,
  syncAchievementsFromGameplay,
} from '@/services/achievements/achievementProgressService';

vi.mock('@/storage/progressStorage', () => ({
  getCompletedLessons: vi.fn(() => ['l1', 'l2']),
  getStoredPractices: vi.fn(() => [{ percentage: 100 }, { percentage: 80 }]),
  getStoredExams: vi.fn(() => []),
}));

vi.mock('@/services/streak', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/services/streak')>();
  return {
    ...actual,
    loadStreakState: vi.fn(async () => ({ dates: ['2026-06-01'], longestStreak: 1 })),
  };
});

vi.mock('@/services/persistence/coinsPersistence', () => ({
  addCoinsBalance: vi.fn(async () => 2000),
}));

vi.mock('@/services/demo/demoGamification', () => ({
  getDemoTotalXP: vi.fn(() => 0),
  addDemoXP: vi.fn(() => 100),
}));

describe('achievementProgressService', () => {
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
    });
  });

  it('persiste progreso demo y desbloquea primera práctica', async () => {
    await syncAchievementsFromGameplay(DEMO_USER_ID);
    const saved = readAchievementProgress(DEMO_USER_ID);
    expect(saved.practice_1?.unlocked).toBe(true);
    expect(saved.study_1?.current).toBe(2);
    expect(saved.perf_1?.unlocked).toBe(true);
  });
});
