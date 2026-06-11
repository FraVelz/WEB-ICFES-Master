import { ACHIEVEMENTS_DATA } from '@/shared/constants/achievementsData';
import { gamificationPersistence } from '@/services/persistence';
import GamificationSupabaseService from '@/services/supabase/GamificationSupabaseService';
import { STREAK_ACHIEVEMENT_ID, type AchievementProgressRecord } from './gamificationTypes';

function parseAchievements(raw: unknown): AchievementProgressRecord {
  if (typeof raw === 'object' && raw !== null && !Array.isArray(raw)) {
    return raw as AchievementProgressRecord;
  }
  return {};
}

export async function syncStreakAchievement(
  userId: string,
  streakValue: number,
  lastSyncedStreak: { current: number }
): Promise<void> {
  if (streakValue <= lastSyncedStreak.current) return;

  const ach = ACHIEVEMENTS_DATA.find((a) => a.id === STREAK_ACHIEVEMENT_ID);
  if (!ach) return;

  const profile = await gamificationPersistence.getProfile(userId);
  const achProgress = parseAchievements(profile?.achievements);
  const current = achProgress[STREAK_ACHIEVEMENT_ID]?.current ?? 0;

  if (streakValue <= current) {
    lastSyncedStreak.current = streakValue;
    return;
  }

  achProgress[STREAK_ACHIEVEMENT_ID] = {
    current: streakValue,
    unlocked: streakValue >= ach.target,
    unlockedAt: streakValue >= ach.target ? new Date().toISOString() : null,
  };

  await GamificationSupabaseService.updateAchievements(userId, achProgress);

  if (streakValue >= ach.target) {
    await gamificationPersistence.addCoins(userId, ach.coinsReward || 0, 'achievement');
    await gamificationPersistence.addXP(userId, ach.xpReward || 0, 'achievement');
  }

  lastSyncedStreak.current = streakValue;
}
