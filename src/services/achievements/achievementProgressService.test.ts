import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DEMO_USER_ID } from '@/services/demo/demoCoins';
import { addCoinsBalance } from '@/services/persistence/coinsPersistence';
import {
  mergeAchievementProgressMaps,
  readAchievementProgress,
  reconcileAchievementsWithoutRewards,
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

vi.mock('@/services/persistence/gamificationPersistence', () => ({
  gamificationPersistence: {
    getProfile: vi.fn(async () => ({ xp: 0 })),
    addXP: vi.fn(),
    addCoins: vi.fn(),
  },
}));

vi.mock('@/services/supabase/GamificationSupabaseService', () => ({
  default: {
    updateAchievements: vi.fn(async () => ({})),
  },
}));

vi.mock('@/services/persistence/supabaseConfigured', () => ({
  isSupabaseConfigured: vi.fn(() => true),
}));

vi.mock('@/services/demo/demoGamification', () => ({
  getDemoTotalXP: vi.fn(() => 0),
  addDemoXP: vi.fn(() => 100),
}));

describe('achievementProgressService', () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    storage.clear();
    vi.mocked(addCoinsBalance).mockClear();
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

  it('mergeAchievementProgressMaps conserva el mayor progreso y desbloqueos', () => {
    const merged = mergeAchievementProgressMaps(
      { practice_1: { current: 1, unlocked: true, unlockedAt: '2026-01-01' } },
      { practice_1: { current: 0, unlocked: false, unlockedAt: null } }
    );
    expect(merged.practice_1?.unlocked).toBe(true);
    expect(merged.practice_1?.current).toBe(1);
    expect(merged.practice_1?.unlockedAt).toBe('2026-01-01');
  });

  it('reconcileAchievementsWithoutRewards no otorga monedas por logros ya migrados', async () => {
    storage.set(
      'icfes_achievement_progress_demo',
      JSON.stringify({
        practice_1: { current: 1, unlocked: true, unlockedAt: '2026-01-01' },
      })
    );

    await reconcileAchievementsWithoutRewards('user-abc');

    const saved = readAchievementProgress('user-abc');
    expect(saved.practice_1?.unlocked).toBe(true);
    expect(vi.mocked(addCoinsBalance)).not.toHaveBeenCalled();
  });

  it('syncAchievementsFromGameplay no pierde progreso previo al recalcular', async () => {
    storage.set(
      'icfes_achievement_progress_user-abc',
      JSON.stringify({
        exam_1: { current: 1, unlocked: true, unlockedAt: '2026-01-01' },
      })
    );

    await syncAchievementsFromGameplay('user-abc');

    const saved = readAchievementProgress('user-abc');
    expect(saved.exam_1?.unlocked).toBe(true);
    expect(saved.practice_1?.unlocked).toBe(true);
  });
});
