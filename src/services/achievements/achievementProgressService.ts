import { ACHIEVEMENTS_DATA } from '@/shared/constants/achievementsData';
import { DEMO_USER_ID, isDemoUserId } from '@/services/demo/demoCoins';
import { addDemoXP, getDemoTotalXP } from '@/services/demo/demoGamification';
import { gamificationPersistence } from '@/services/persistence/gamificationPersistence';
import { addCoinsBalance } from '@/services/persistence/coinsPersistence';
import { isSupabaseMode } from '@/services/persistence/apiMode';
import { calculateLevel } from '@/services/gamification/gamificationUtils';
import GamificationSupabaseService from '@/services/supabase/GamificationSupabaseService';
import { getStreakMetrics, loadStreakState, type StreakScope } from '@/services/streak';
import { getCompletedLessons, getStoredExams, getStoredPractices } from '@/storage/progressStorage';

export type AchievementProgressEntry = {
  current: number;
  unlocked: boolean;
  unlockedAt: string | null;
};

export type AchievementProgressMap = Record<string, AchievementProgressEntry>;

const GAMIFICATION_KEY = 'icfes_gamification';

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
  if (stored) {
    try {
      return normalizeAchievementsRecord(JSON.parse(stored));
    } catch {
      return {};
    }
  }

  if (isDemoUserId(userId)) return {};

  const gamStored = localStorage.getItem(GAMIFICATION_KEY);
  if (!gamStored) return {};

  try {
    const gam = JSON.parse(gamStored) as { achievements?: unknown };
    return normalizeAchievementsRecord(gam.achievements);
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
    const totalXP = profile?.totalXP ?? profile?.xp ?? 0;
    return profile?.level ?? calculateLevel(Number(totalXP));
  } catch {
    return 1;
  }
}

function buildProgressFromGameplay(
  completedLessons: number,
  practiceCount: number,
  examCount: number,
  perfectCount: number,
  currentStreak: number,
  level: number
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

async function awardNewUnlocks(
  userId: string,
  previous: AchievementProgressMap,
  next: AchievementProgressMap
): Promise<void> {
  for (const achievement of ACHIEVEMENTS_DATA) {
    const wasUnlocked = previous[achievement.id]?.unlocked ?? false;
    const isUnlocked = next[achievement.id]?.unlocked ?? false;
    if (!isUnlocked || wasUnlocked) continue;

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
}

export async function syncAchievementsFromGameplay(userId: string): Promise<AchievementProgressMap> {
  const previous = readAchievementProgress(userId);
  const scope = toStreakScope(userId);
  const streakState = await loadStreakState(scope);
  const streakMetrics = getStreakMetrics(streakState);
  const level = await readLevel(userId);

  const next = buildProgressFromGameplay(
    getCompletedLessons().length,
    getStoredPractices().length,
    getStoredExams().length,
    countPerfectAttempts(getStoredPractices() as Array<Record<string, unknown>>) +
      countPerfectAttempts(getStoredExams() as Array<Record<string, unknown>>),
    streakMetrics.currentStreak,
    level
  );

  // Preserve unlock timestamps when already unlocked
  for (const achievement of ACHIEVEMENTS_DATA) {
    const prev = previous[achievement.id];
    if (prev?.unlocked && next[achievement.id]?.unlocked) {
      next[achievement.id] = {
        ...next[achievement.id],
        unlockedAt: prev.unlockedAt ?? next[achievement.id].unlockedAt,
      };
    }
  }

  await awardNewUnlocks(userId, previous, next);
  writeAchievementProgress(userId, next);

  if (!isDemoUserId(userId) && isSupabaseMode()) {
    await GamificationSupabaseService.updateAchievements(userId, next as Record<string, unknown>);
  }

  return next;
}

export function resolveAchievementUserId(authUserId?: string | null, demoMode?: boolean): string | null {
  if (authUserId && authUserId !== DEMO_USER_ID) return authUserId;
  if (demoMode) return DEMO_USER_ID;
  return null;
}
