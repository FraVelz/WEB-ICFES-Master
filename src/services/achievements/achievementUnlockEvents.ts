import { ACHIEVEMENTS_DATA } from '@/shared/constants/achievementsData';
import { getAchievementChainMetaForTier } from '@/shared/constants/achievements/achievementChains';

export type AchievementUnlockPayload = {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  coinsReward: number;
  category: string;
  chainTitle?: string;
  tierLevel?: number;
  tierCount?: number;
};

export const ACHIEVEMENT_UNLOCK_EVENT = 'icfes:achievement-unlock';

type AchievementDefinition = (typeof ACHIEVEMENTS_DATA)[number];

export function achievementToUnlockPayload(achievement: AchievementDefinition): AchievementUnlockPayload {
  const chainMeta = getAchievementChainMetaForTier(achievement.id);

  return {
    id: achievement.id,
    title: achievement.title,
    description: achievement.description,
    icon: achievement.icon,
    xpReward: achievement.xpReward,
    coinsReward: achievement.coinsReward,
    category: achievement.category,
    chainTitle: chainMeta?.chainTitle,
    tierLevel: chainMeta?.tierLevel,
    tierCount: chainMeta?.tierCount,
  };
}

export function emitAchievementUnlock(payload: AchievementUnlockPayload): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<AchievementUnlockPayload>(ACHIEVEMENT_UNLOCK_EVENT, { detail: payload }));
}

export function emitAchievementUnlocks(achievements: AchievementDefinition[]): void {
  for (const achievement of achievements) {
    emitAchievementUnlock(achievementToUnlockPayload(achievement));
  }
}
