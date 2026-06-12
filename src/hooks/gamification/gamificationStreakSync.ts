import { ACHIEVEMENTS_DATA } from '@/shared/constants/achievementsData';
import { STREAK_ACHIEVEMENT_IDS } from '@/shared/constants/achievements/achievementsConstancyMetas';
import { achievementToUnlockPayload, emitAchievementUnlock } from '@/services/achievements/achievementUnlockEvents';
import { gamificationPersistence } from '@/services/persistence';
import GamificationSupabaseService from '@/services/supabase/GamificationSupabaseService';
import type { AchievementProgressRecord } from './gamificationTypes';

function parseAchievements(raw: unknown): AchievementProgressRecord {
  if (typeof raw === 'object' && raw !== null && !Array.isArray(raw)) {
    return raw as AchievementProgressRecord;
  }
  return {};
}

export async function syncStreakAchievement(
  userId: string,
  longestStreak: number,
  lastSyncedStreak: { current: number }
): Promise<void> {
  if (longestStreak <= lastSyncedStreak.current) return;

  const profile = await gamificationPersistence.getProfile(userId);
  const achProgress = parseAchievements(profile?.achievements);
  let changed = false;

  for (const achievementId of STREAK_ACHIEVEMENT_IDS) {
    const ach = ACHIEVEMENTS_DATA.find((item) => item.id === achievementId);
    if (!ach) continue;

    const current = achProgress[achievementId]?.current ?? 0;
    const nextCurrent = Math.min(longestStreak, ach.target);
    if (nextCurrent <= current) continue;

    achProgress[achievementId] = {
      current: nextCurrent,
      unlocked: nextCurrent >= ach.target,
      unlockedAt: nextCurrent >= ach.target ? new Date().toISOString() : null,
    };
    changed = true;

    if (nextCurrent >= ach.target) {
      await gamificationPersistence.addCoins(userId, ach.coinsReward || 0, 'achievement');
      await gamificationPersistence.addXP(userId, ach.xpReward || 0, 'achievement');
      emitAchievementUnlock(achievementToUnlockPayload(ach));
    }
  }

  if (!changed) {
    lastSyncedStreak.current = longestStreak;
    return;
  }

  await GamificationSupabaseService.updateAchievements(userId, achProgress);
  lastSyncedStreak.current = longestStreak;
}
