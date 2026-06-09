import { ACHIEVEMENTS_DATA } from '@/shared/constants/achievementsData';
import { DEMO_USER_ID, isDemoUserId } from '@/services/demo/demoCoins';
import { addDemoXP, getDemoTotalXP } from '@/services/demo/demoGamification';
import { gamificationPersistence } from '@/services/persistence/gamificationPersistence';
import { addCoinsBalance } from '@/services/persistence/coinsPersistence';
import { isSupabaseConfigured } from '@/services/persistence/supabaseConfigured';
import { calculateLevel } from '@/services/gamification/gamificationUtils';
import GamificationSupabaseService from '@/services/supabase/GamificationSupabaseService';
import { getStreakMetrics, loadStreakState, type StreakScope } from '@/services/streak';
import { getCompletedLessons, getStoredExams, getStoredPractices } from '@/storage/progressStorage';
import { loadLecturaReadSections } from '@/features/lectura/services/lecturaReadPersistence';
import { getStudyTimeStats, STUDY_TIME_META_KEY } from '@/services/studyTime/studyTimeService';

export type AchievementProgressEntry = {
  current: number;
  unlocked: boolean;
  unlockedAt: string | null;
};

export type AchievementProgressMap = Record<string, AchievementProgressEntry>;

function progressStorageKey(userId: string): string {
  return `icfes_achievement_progress_${userId}`;
}

export function normalizeAchievementsRecord(raw: unknown): AchievementProgressMap {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return {};
  return raw as AchievementProgressMap;
}

export function readAchievementProgress(userId: string): AchievementProgressMap {
  if (typeof window === 'undefined') return {};

  const stored = localStorage.getItem(progressStorageKey(userId));
  if (!stored) return {};

  try {
    return normalizeAchievementsRecord(JSON.parse(stored));
  } catch {
    return {};
  }
}

export function writeAchievementProgress(userId: string, progress: AchievementProgressMap): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(progressStorageKey(userId), JSON.stringify(progress));
}

function toStreakScope(userId: string): StreakScope {
  return isDemoUserId(userId) ? 'demo' : userId;
}

function countPerfectAttempts(items: Array<Record<string, unknown>>): number {
  return items.filter((item) => Number(item.percentage) === 100).length;
}

async function readLevel(userId: string): Promise<number> {
  if (isDemoUserId(userId)) {
    return calculateLevel(getDemoTotalXP());
  }

  try {
    const profile = await gamificationPersistence.getProfile(userId);
    return calculateLevel(Number(profile?.xp ?? 0));
  } catch {
    return 1;
  }
}

/** Fusiona dos mapas de logros tomando el mayor progreso y preservando desbloqueos previos. */
export function mergeAchievementProgressMaps(
  base: AchievementProgressMap,
  incoming: AchievementProgressMap
): AchievementProgressMap {
  const merged: AchievementProgressMap = { ...base };

  for (const achievement of ACHIEVEMENTS_DATA) {
    const a = base[achievement.id];
    const b = incoming[achievement.id];
    if (!a && !b) continue;

    const current = Math.max(a?.current ?? 0, b?.current ?? 0);
    const capped = Math.min(current, achievement.target);
    const unlocked = (a?.unlocked ?? false) || (b?.unlocked ?? false) || capped >= achievement.target;
    const unlockedTimestamps = [a?.unlockedAt, b?.unlockedAt]
      .filter(Boolean)
      .map((date) => new Date(date as string).getTime());
    const unlockedAt = unlocked
      ? (unlockedTimestamps.length > 0
          ? new Date(Math.min(...unlockedTimestamps)).toISOString()
          : new Date().toISOString())
      : null;

    merged[achievement.id] = { current: capped, unlocked, unlockedAt };
  }

  return merged;
}

function buildProgressFromGameplay(
  completedLessons: number,
  practiceCount: number,
  examCount: number,
  perfectCount: number,
  currentStreak: number,
  level: number,
  readImportancia: number,
  readInformacion: number,
  readConsejos: number,
  longestStudySessionMinutes: number
): AchievementProgressMap {
  const metrics: Record<string, number> = {
    study_1: completedLessons,
    study_2: completedLessons,
    perf_1: perfectCount,
    const_1: currentStreak,
    meta_1: level,
    practice_1: practiceCount,
    practice_5: practiceCount,
    exam_1: examCount,
    time_1: longestStudySessionMinutes,
    read_importancia: readImportancia,
    read_informacion: readInformacion,
    read_consejos: readConsejos,
  };

  const next: AchievementProgressMap = {};

  for (const achievement of ACHIEVEMENTS_DATA) {
    const current = metrics[achievement.id] ?? 0;
    const unlocked = current >= achievement.target;
    next[achievement.id] = {
      current: Math.min(current, achievement.target),
      unlocked,
      unlockedAt: unlocked ? new Date().toISOString() : null,
    };
  }

  return next;
}

async function awardAchievementUnlock(
  userId: string,
  achievement: (typeof ACHIEVEMENTS_DATA)[number]
): Promise<void> {
  if (achievement.coinsReward > 0) {
    await addCoinsBalance(userId, achievement.coinsReward, `achievement_${achievement.id}`);
  }

  if (achievement.xpReward > 0) {
    if (isDemoUserId(userId)) {
      addDemoXP(achievement.xpReward);
    } else {
      await gamificationPersistence.addXP(userId, achievement.xpReward, `achievement_${achievement.id}`);
    }
  }
}

async function awardNewUnlocks(
  userId: string,
  previous: AchievementProgressMap,
  next: AchievementProgressMap
): Promise<void> {
  const newlyUnlocked = ACHIEVEMENTS_DATA.filter((achievement) => {
    const wasUnlocked = previous[achievement.id]?.unlocked ?? false;
    const isUnlocked = next[achievement.id]?.unlocked ?? false;
    return isUnlocked && !wasUnlocked;
  });

  await Promise.all(newlyUnlocked.map((achievement) => awardAchievementUnlock(userId, achievement)));
}

async function computeAchievementProgressFromGameplay(userId: string): Promise<AchievementProgressMap> {
  const scope = toStreakScope(userId);
  const streakState = await loadStreakState(scope);
  const streakMetrics = getStreakMetrics(streakState);
  const level = await readLevel(userId);
  const readSections = loadLecturaReadSections(userId);
  const studyTime = getStudyTimeStats(userId);

  return buildProgressFromGameplay(
    getCompletedLessons().length,
    getStoredPractices().length,
    getStoredExams().length,
    countPerfectAttempts(getStoredPractices() as Array<Record<string, unknown>>) +
      countPerfectAttempts(getStoredExams() as Array<Record<string, unknown>>),
    streakMetrics.currentStreak,
    level,
    readSections.includes('importancia') ? 1 : 0,
    readSections.includes('informacion') ? 1 : 0,
    readSections.includes('consejos') ? 1 : 0,
    studyTime.longestSessionMinutes
  );
}

/**
 * Reconcilia logros desde gameplay + baseline (p. ej. demo) sin otorgar recompensas.
 * Usar en migración demo → cuenta para evitar duplicar monedas/XP.
 */
async function loadRemoteAchievementProgress(userId: string): Promise<AchievementProgressMap> {
  if (isDemoUserId(userId) || !isSupabaseConfigured()) return {};

  try {
    const profile = await gamificationPersistence.getProfile(userId);
    return normalizeAchievementsRecord(profile?.achievements);
  } catch {
    return {};
  }
}

function attachStudyTimeMeta(userId: string, progress: AchievementProgressMap): Record<string, unknown> {
  const studyStats = getStudyTimeStats(userId);
  return {
    ...progress,
    [STUDY_TIME_META_KEY]: {
      totalMinutes: studyStats.totalMinutes,
      longestSessionMinutes: studyStats.longestSessionMinutes,
    },
  };
}

export async function reconcileAchievementsWithoutRewards(
  userId: string,
  extraBaseline: AchievementProgressMap = {}
): Promise<AchievementProgressMap> {
  const remote = await loadRemoteAchievementProgress(userId);
  const local = readAchievementProgress(userId);
  const demoBaseline = readAchievementProgress(DEMO_USER_ID);
  const baseline = mergeAchievementProgressMaps(
    remote,
    mergeAchievementProgressMaps(local, mergeAchievementProgressMaps(demoBaseline, extraBaseline))
  );
  const computed = await computeAchievementProgressFromGameplay(userId);
  const merged = mergeAchievementProgressMaps(baseline, computed);

  if (!isDemoUserId(userId) && isSupabaseConfigured()) {
    await GamificationSupabaseService.updateAchievements(userId, attachStudyTimeMeta(userId, merged));
  }
  writeAchievementProgress(userId, merged);

  return merged;
}

export async function syncAchievementsFromGameplay(userId: string): Promise<AchievementProgressMap> {
  const remote = await loadRemoteAchievementProgress(userId);
  const local = readAchievementProgress(userId);
  const previous = mergeAchievementProgressMaps(remote, local);
  const computed = await computeAchievementProgressFromGameplay(userId);
  const next = mergeAchievementProgressMaps(previous, computed);

  await awardNewUnlocks(userId, previous, next);

  if (!isDemoUserId(userId) && isSupabaseConfigured()) {
    await GamificationSupabaseService.updateAchievements(userId, attachStudyTimeMeta(userId, next));
  }
  writeAchievementProgress(userId, next);

  return next;
}

export function resolveAchievementUserId(authUserId?: string | null, demoMode?: boolean): string | null {
  if (authUserId && authUserId !== DEMO_USER_ID) return authUserId;
  if (demoMode) return DEMO_USER_ID;
  return null;
}
