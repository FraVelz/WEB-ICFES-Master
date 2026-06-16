import { ACHIEVEMENTS_DATA } from '@/shared/constants/achievementsData';
import {
  addCoinsServer,
  addXpServerWithMultiplier,
  getProfileRow,
  hasRewardReason,
} from '@/services/supabase/gamification/gamificationServerEconomy';

type AchievementProgressEntry = { unlocked?: boolean };

function parseAchievements(raw: unknown): Record<string, AchievementProgressEntry> {
  if (typeof raw === 'object' && raw !== null && !Array.isArray(raw)) {
    return raw as Record<string, AchievementProgressEntry>;
  }
  return {};
}

function achievementReason(achievementId: string): string {
  return `achievement_${achievementId}`;
}

/** Otorga recompensas fijas por logro desbloqueado en el perfil del usuario. */
export async function awardAchievementRewardsServer(
  userId: string,
  achievementIds: string[]
): Promise<{ awarded: string[]; skipped: string[] }> {
  const uniqueIds = [
    ...new Set(
      achievementIds.flatMap((id) => {
        const trimmed = id.trim();
        return trimmed ? [trimmed] : [];
      })
    ),
  ];
  if (uniqueIds.length === 0) {
    return { awarded: [], skipped: [] };
  }

  const { profile } = await getProfileRow(userId);
  const progress = parseAchievements(profile?.achievements);

  const awarded: string[] = [];
  const skipped: string[] = [];

  await Promise.all(
    uniqueIds.map(async (achievementId) => {
      const achievement = ACHIEVEMENTS_DATA.find((item) => item.id === achievementId);
      if (!achievement) {
        skipped.push(achievementId);
        return;
      }

      if (!progress[achievementId]?.unlocked) {
        skipped.push(achievementId);
        return;
      }

      const reason = achievementReason(achievementId);
      if (await hasRewardReason(userId, reason)) {
        skipped.push(achievementId);
        return;
      }

      const rewards: Promise<unknown>[] = [];
      if (achievement.coinsReward > 0) {
        rewards.push(addCoinsServer(userId, achievement.coinsReward, reason));
      }
      if (achievement.xpReward > 0) {
        rewards.push(addXpServerWithMultiplier(userId, achievement.xpReward, reason));
      }
      await Promise.all(rewards);

      awarded.push(achievementId);
    })
  );

  return { awarded, skipped };
}
