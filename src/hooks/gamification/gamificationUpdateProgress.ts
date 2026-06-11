import { ACHIEVEMENTS_DATA } from '@/shared/constants/achievementsData';
import { gamificationPersistence } from '@/services/persistence';
import { addCoinsBalance } from '@/services/persistence/coinsPersistence';
import { isDemoUserId } from '@/services/demo/demoCoins';
import { addDemoXP } from '@/services/demo/demoGamification';
import GamificationSupabaseService from '@/services/supabase/GamificationSupabaseService';
import type { AchievementProgressRecord } from './gamificationTypes';

function parseAchievements(raw: unknown): AchievementProgressRecord {
  if (typeof raw === 'object' && raw !== null && !Array.isArray(raw)) {
    return raw as AchievementProgressRecord;
  }
  return {};
}

export async function updateAchievementProgressForUser(
  userId: string,
  accountUserId: string | undefined,
  isDemoScope: boolean,
  achievementId: string,
  amount: number,
  onReload: () => void
): Promise<void> {
  const ach = ACHIEVEMENTS_DATA.find((a) => a.id === achievementId);
  if (!ach) return;

  if (isDemoUserId(userId)) {
    const { readAchievementProgress, writeAchievementProgress } =
      await import('@/services/achievements/achievementProgressService');
    const progress = readAchievementProgress(userId);
    const current = progress[achievementId] ?? {};
    if (current.unlocked) return;

    const newCurrent = (current.current || 0) + amount;
    const unlocked = newCurrent >= ach.target;
    progress[achievementId] = {
      current: newCurrent,
      unlocked,
      unlockedAt: unlocked ? new Date().toISOString() : null,
    };
    writeAchievementProgress(userId, progress);

    if (unlocked) {
      await addCoinsBalance(userId, ach.coinsReward || 0, 'achievement');
      addDemoXP(ach.xpReward || 0);
    }
    onReload();
    return;
  }

  if (!accountUserId) return;

  const profile = await gamificationPersistence.getProfile(accountUserId);
  const achProgress = parseAchievements(profile?.achievements);
  const current = achProgress[achievementId] ?? {};
  if (current.unlocked) return;

  const newCurrent = (current.current || 0) + amount;
  const unlocked = newCurrent >= ach.target;
  achProgress[achievementId] = {
    current: newCurrent,
    unlocked,
    unlockedAt: unlocked ? new Date().toISOString() : null,
  };

  if (unlocked) {
    await gamificationPersistence.addCoins(accountUserId, ach.coinsReward || 0, 'achievement');
  }
  await gamificationPersistence.addXP(accountUserId, unlocked ? ach.xpReward || 0 : 0, 'achievement');
  await GamificationSupabaseService.updateAchievements(accountUserId, achProgress);
  onReload();
}
