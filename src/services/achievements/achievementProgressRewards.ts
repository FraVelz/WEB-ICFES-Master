import { ACHIEVEMENTS_DATA } from '@/shared/constants/achievementsData';
import { DEMO_USER_ID, isDemoUserId } from '@/services/demo/demoCoins';
import { addDemoXP } from '@/services/demo/demoGamification';
import { addCoinsBalance } from '@/services/persistence/coinsPersistence';
import { gamificationPersistence } from '@/services/persistence/gamificationPersistence';
import type { AchievementProgressMap } from './achievementProgressTypes';

async function awardAchievementUnlock(userId: string, achievement: (typeof ACHIEVEMENTS_DATA)[number]): Promise<void> {
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

export async function awardNewUnlocks(
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

export function resolveAchievementUserId(authUserId?: string | null, demoMode?: boolean): string | null {
  if (authUserId && authUserId !== DEMO_USER_ID) return authUserId;
  if (demoMode) return DEMO_USER_ID;
  return null;
}
