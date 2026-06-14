import { gamificationPersistence, getCoinsBalance } from '@/services/persistence';
import { DEMO_USER_ID } from '@/services/demo/demoCoins';
import { getDemoTotalXP } from '@/services/demo/demoGamification';
import { calculateLevel } from '@/services/gamification/gamificationUtils';
import {
  normalizeAchievementsRecord,
  syncAchievementsFromGameplay,
  type AchievementProgressMap,
} from '@/services/achievements/achievementProgressService';
import { backfillStreakFromAttempts, getStreakMetrics, loadStreakState, type StreakScope } from '@/services/streak';
import { countCompletedAchievements, mergeAchievements } from './gamificationAchievementMerge';
import type { AchievementMerged } from './gamificationTypes';

export type GamificationBundle = {
  achievements: AchievementMerged[];
  completedCount: number;
  coins: number;
  totalXP: number;
  level: number;
  streak: string[];
  currentStreak: number;
  longestStreak: number;
};

export async function fetchGamificationBundle(scope: StreakScope): Promise<GamificationBundle> {
  const isDemoScope = scope === 'demo';
  const accountUserId = scope !== 'demo' ? scope : undefined;
  const achievementUserId = accountUserId ?? (isDemoScope ? DEMO_USER_ID : null);

  let achProgress: AchievementProgressMap = {};
  let profile: Awaited<ReturnType<typeof gamificationPersistence.getProfile>> | null = null;
  let coins = 0;
  let totalXP = 0;
  let level = 1;

  if (accountUserId) {
    profile = await gamificationPersistence.getProfile(accountUserId);
    totalXP = profile?.xp ?? 0;
    level = calculateLevel(totalXP);
    coins = (profile?.totalCoins ?? 0) - (profile?.spentCoins ?? 0);
  }

  await backfillStreakFromAttempts(scope);
  const streakState = await loadStreakState(scope);
  const metrics = getStreakMetrics(streakState);

  if (achievementUserId) {
    const { progress: syncedProgress } = await syncAchievementsFromGameplay(achievementUserId, {
      remoteAchievements: profile ? normalizeAchievementsRecord(profile.achievements) : undefined,
      userLevel: profile ? calculateLevel(profile.xp ?? 0) : undefined,
      currentStreak: metrics.currentStreak,
      longestStreak: metrics.longestStreak,
    });
    achProgress = syncedProgress;
  }

  if (isDemoScope && achievementUserId) {
    coins = await getCoinsBalance(DEMO_USER_ID);
    totalXP = getDemoTotalXP();
    level = calculateLevel(totalXP);
  }

  const merged = mergeAchievements(achProgress);

  return {
    achievements: merged,
    completedCount: countCompletedAchievements(merged),
    coins,
    totalXP,
    level,
    streak: metrics.dates,
    currentStreak: metrics.currentStreak,
    longestStreak: metrics.longestStreak,
  };
}
