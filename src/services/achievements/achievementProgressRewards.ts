import { ACHIEVEMENTS_DATA } from '@/shared/constants/achievementsData';
import { DEMO_USER_ID, isDemoUserId } from '@/services/demo/demoCoins';
import { addDemoXP } from '@/services/demo/demoGamification';
import { awardAchievementsViaApi } from '@/services/gamification/gamificationRewardClient';
import { addCoinsBalance } from '@/services/persistence/coinsPersistence';
import type { AchievementProgressMap } from './achievementProgressTypes';

async function awardDemoAchievementUnlock(achievement: (typeof ACHIEVEMENTS_DATA)[number]): Promise<void> {
  if (achievement.coinsReward > 0) {
    await addCoinsBalance(DEMO_USER_ID, achievement.coinsReward, `achievement_${achievement.id}`);
  }

  if (achievement.xpReward > 0) {
    addDemoXP(achievement.xpReward);
  }
}

export async function awardNewUnlocks(
  userId: string,
  previous: AchievementProgressMap,
  next: AchievementProgressMap
): Promise<number> {
  const newlyUnlocked = ACHIEVEMENTS_DATA.filter((achievement) => {
    const wasUnlocked = previous[achievement.id]?.unlocked ?? false;
    const isUnlocked = next[achievement.id]?.unlocked ?? false;
    return isUnlocked && !wasUnlocked;
  });

  if (newlyUnlocked.length === 0) {
    return 0;
  }

  if (isDemoUserId(userId)) {
    await Promise.all(newlyUnlocked.map((achievement) => awardDemoAchievementUnlock(achievement)));
  } else {
    await awardAchievementsViaApi(newlyUnlocked.map((achievement) => achievement.id));
  }

  const { emitAchievementUnlocks } = await import('./achievementUnlockEvents');
  emitAchievementUnlocks(newlyUnlocked);

  return newlyUnlocked.length;
}

export function resolveAchievementUserId(authUserId?: string | null, demoMode?: boolean): string | null {
  if (authUserId && authUserId !== DEMO_USER_ID) return authUserId;
  if (demoMode) return DEMO_USER_ID;
  return null;
}
