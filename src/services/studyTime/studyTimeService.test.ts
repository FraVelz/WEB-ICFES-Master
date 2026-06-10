import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DEMO_USER_ID } from '@/services/demo/demoCoins';
import {
  finalizeStudyTimeSession,
  formatStudyTime,
  getStudyTimeStats,
  loadStudyTimeState,
  MARATHON_TARGET_MINUTES,
  processStudyTimeActivity,
  readStudyTimeRemoteMeta,
  resetStudyTimeActivityThrottleForTests,
} from '@/services/studyTime';
import { saveStudyTimeState } from './studyTimeService';

vi.mock('@/services/achievements/achievementProgressService', () => ({
  syncAchievementsFromGameplay: vi.fn(async () => ({})),
}));

vi.mock('@/services/supabase/GamificationSupabaseService', () => ({
  default: {
    getByUserId: vi.fn(async () => null),
    updateAchievements: vi.fn(async () => ({})),
  },
}));

vi.mock('@/services/persistence/supabaseConfigured', () => ({
  isSupabaseConfigured: vi.fn(() => false),
}));

describe('studyTimeService', () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    storage.clear();
    resetStudyTimeActivityThrottleForTests();
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

  it('acumula minutos de estudio en sesiones activas', async () => {
    const start = Date.now();
    await processStudyTimeActivity(DEMO_USER_ID, start);
    await processStudyTimeActivity(DEMO_USER_ID, start + 65_000);

    const stats = getStudyTimeStats(DEMO_USER_ID);
    expect(stats.totalMinutes).toBeGreaterThanOrEqual(1);
  });

  it('registra sesiones largas para el logro maratón', async () => {
    const start = Date.now();
    const marathonSeconds = MARATHON_TARGET_MINUTES * 60;
    const sessionEnd = start + marathonSeconds * 1000;

    saveStudyTimeState(DEMO_USER_ID, {
      totalSeconds: marathonSeconds,
      longestSessionSeconds: marathonSeconds,
      sessionStartedAt: start,
      lastActivityAt: sessionEnd,
    });

    await finalizeStudyTimeSession(DEMO_USER_ID, sessionEnd);
    const state = loadStudyTimeState(DEMO_USER_ID);
    expect(Math.floor(state.longestSessionSeconds / 60)).toBe(MARATHON_TARGET_MINUTES);
  });

  it('reinicia la sesión tras inactividad prolongada', async () => {
    const start = Date.now();
    await processStudyTimeActivity(DEMO_USER_ID, start);
    await finalizeStudyTimeSession(DEMO_USER_ID, start + 2 * 60_000);

    const beforeBreak = loadStudyTimeState(DEMO_USER_ID);
    expect(beforeBreak.sessionStartedAt).toBeNull();

    await processStudyTimeActivity(DEMO_USER_ID, start + 10 * 60_000);
    const afterBreak = loadStudyTimeState(DEMO_USER_ID);
    expect(afterBreak.sessionStartedAt).not.toBeNull();
  });

  it('formatStudyTime muestra horas y minutos', () => {
    expect(formatStudyTime(45)).toBe('45 min');
    expect(formatStudyTime(60)).toBe('1 h');
    expect(formatStudyTime(130)).toBe('2 h 10 min');
  });

  it('readStudyTimeRemoteMeta extrae metadatos del JSON de logros', () => {
    expect(
      readStudyTimeRemoteMeta({
        time_1: { current: 120, unlocked: true, unlockedAt: '2026-01-01' },
        _studyTime: { totalMinutes: 300, longestSessionMinutes: 120 },
      })
    ).toEqual({ totalMinutes: 300, longestSessionMinutes: 120 });
  });
});
