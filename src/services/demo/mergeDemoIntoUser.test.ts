import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  clearDemoLocalStorageAfterMigration,
  hasDemoDataToMigrate,
  mergeDemoIntoUser,
} from '@/services/demo/mergeDemoIntoUser';
import { migrateLocalAttemptsToSupabase } from '@/services/demo/migrateLocalAttemptsToSupabase';
import { gamificationPersistence } from '@/services/persistence/gamificationPersistence';
import ProgressSupabaseService from '@/services/supabase/ProgressSupabaseService';
import UserSupabaseService from '@/services/supabase/UserSupabaseService';
import { mergeDemoStreakIntoUser } from '@/services/streak';
import { reconcileAchievementsWithoutRewards } from '@/services/achievements/achievementProgressService';

vi.mock('@/services/streak', () => ({
  mergeDemoStreakIntoUser: vi.fn(async () => ({ dates: ['2026-06-01'], longestStreak: 1 })),
}));

vi.mock('@/services/achievements/achievementProgressService', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/services/achievements/achievementProgressService')>();
  return {
    ...actual,
    reconcileAchievementsWithoutRewards: vi.fn(async () => ({})),
  };
});

vi.mock('@/services/supabase/UserSupabaseService', () => ({
  default: {
    updateSkillLevel: vi.fn(async () => ({})),
  },
}));

vi.mock('@/services/persistence/gamificationPersistence', () => ({
  gamificationPersistence: {
    addCoins: vi.fn(async () => ({})),
    addXP: vi.fn(async () => ({})),
  },
}));

vi.mock('@/services/supabase/ProgressSupabaseService', () => ({
  default: {
    getByUserId: vi.fn(async () => null),
    upsert: vi.fn(async () => ({})),
  },
}));

vi.mock('@/services/persistence/supabaseConfigured', () => ({
  isSupabaseConfigured: vi.fn(() => true),
}));

vi.mock('@/services/demo/migrateLocalAttemptsToSupabase', () => ({
  migrateLocalAttemptsToSupabase: vi.fn(async () => 2),
}));

vi.mock('@/storage/progressStorage', () => ({
  getProgress: vi.fn(() => ({
    totalAttempts: 3,
    totalCorrect: 10,
    percentage: 80,
    streakDays: 2,
    lastAttemptDate: '2026-06-01T00:00:00.000Z',
    areaStats: {},
  })),
  getStoredExams: vi.fn(() => []),
  getStoredPractices: vi.fn(() => []),
}));

describe('mergeDemoIntoUser', () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    storage.clear();
    vi.clearAllMocks();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
      clear: () => storage.clear(),
      get length() {
        return storage.size;
      },
      key: (index: number) => [...storage.keys()][index] ?? null,
    });
  });

  it('hasDemoDataToMigrate detecta claves demo', () => {
    storage.set('demoMode', 'true');
    expect(hasDemoDataToMigrate()).toBe(true);
    storage.clear();
    storage.set('icfes_demo_coins', '1500');
    expect(hasDemoDataToMigrate()).toBe(true);
  });

  it('migra monedas, XP, nivel, progreso y limpia claves demo', async () => {
    storage.set('demoMode', 'true');
    storage.set('icfes_demo_coins', '1800');
    storage.set('icfes_demo_gamification', JSON.stringify({ totalXP: 250 }));
    storage.set('icfes_level_assessment_done_demo', 'true');
    storage.set('icfes_skill_level_demo', 'intermediate');
    storage.set('icfes_level_assessment_meta_demo', JSON.stringify({ level: 'intermediate', completedAt: '2026-06-01' }));

    await mergeDemoIntoUser('user-abc');

    expect(vi.mocked(mergeDemoStreakIntoUser)).toHaveBeenCalledWith('user-abc');
    expect(vi.mocked(gamificationPersistence.addCoins)).toHaveBeenCalledWith('user-abc', 1800, 'demo_migration');
    expect(vi.mocked(gamificationPersistence.addXP)).toHaveBeenCalledWith('user-abc', 250, 'demo_migration');
    expect(vi.mocked(UserSupabaseService.updateSkillLevel)).toHaveBeenCalledWith('user-abc', 'intermediate');
    expect(vi.mocked(ProgressSupabaseService.upsert)).toHaveBeenCalled();
    expect(vi.mocked(migrateLocalAttemptsToSupabase)).toHaveBeenCalledWith('user-abc');
    expect(vi.mocked(reconcileAchievementsWithoutRewards)).toHaveBeenCalledWith('user-abc');
    expect(storage.has('icfes_demo_coins')).toBe(false);
    expect(storage.has('icfes_demo_gamification')).toBe(false);
    expect(storage.get('icfes_level_assessment_done_user-abc')).toBe('true');
  });

  it('clearDemoLocalStorageAfterMigration elimina claves demo', () => {
    storage.set('icfes_demo_coins', '100');
    storage.set('icfes_achievement_progress_demo', '{}');
    clearDemoLocalStorageAfterMigration();
    expect(storage.has('icfes_demo_coins')).toBe(false);
    expect(storage.has('icfes_achievement_progress_demo')).toBe(false);
  });

  it('no migra si no hay datos demo', async () => {
    await mergeDemoIntoUser('user-abc');
    expect(vi.mocked(mergeDemoStreakIntoUser)).not.toHaveBeenCalled();
    expect(vi.mocked(gamificationPersistence.addCoins)).not.toHaveBeenCalled();
  });
});
