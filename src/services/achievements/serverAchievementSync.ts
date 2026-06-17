import { ACHIEVEMENTS_DATA } from '@/shared/constants/achievementsData';
import { awardAchievementRewardsServer } from '@/services/achievements/achievementRewardServer';
import { GAMIFICATION_TABLE } from '@/services/supabase/gamification/gamificationMappers';
import { getProfileRow } from '@/services/supabase/gamification/gamificationServerEconomy';

type AchievementProgressEntry = {
  current?: number;
  unlocked?: boolean;
  unlockedAt?: string | null;
};

type CountColumn = 'referral_qualified_count' | 'support_approved_count' | 'profile_report_approved_count';

function parseAchievementsObject(raw: unknown): Record<string, unknown> {
  if (typeof raw === 'object' && raw !== null && !Array.isArray(raw)) {
    return { ...(raw as Record<string, unknown>) };
  }
  return {};
}

function isMetaKey(key: string): boolean {
  return key.startsWith('_');
}

/** Sincroniza tiers de una cadena según un contador server-side y otorga recompensas de logro. */
export async function syncAchievementChainFromCount(
  userId: string,
  tierIds: readonly string[],
  count: number,
  countColumn?: CountColumn
): Promise<{ newlyUnlocked: string[] }> {
  const { sb, profile } = await getProfileRow(userId);
  const existing = parseAchievementsObject(profile?.achievements);

  const metaEntries = Object.fromEntries(Object.entries(existing).filter(([key]) => isMetaKey(key)));
  const progressEntries: Record<string, AchievementProgressEntry> = {};
  const newlyUnlocked: string[] = [];

  for (const tierId of tierIds) {
    const achievement = ACHIEVEMENTS_DATA.find((item) => item.id === tierId);
    if (!achievement) continue;

    const previous = existing[tierId] as AchievementProgressEntry | undefined;
    const wasUnlocked = previous?.unlocked ?? false;
    const unlocked = count >= achievement.target;

    progressEntries[tierId] = {
      current: Math.min(count, achievement.target),
      unlocked,
      unlockedAt: unlocked ? (previous?.unlockedAt ?? new Date().toISOString()) : null,
    };

    if (unlocked && !wasUnlocked) {
      newlyUnlocked.push(tierId);
    }
  }

  const achievementsPayload = { ...metaEntries, ...progressEntries };
  const updatePayload: Record<string, unknown> = {
    achievements: achievementsPayload,
    updated_at: new Date().toISOString(),
  };

  if (countColumn) {
    updatePayload[countColumn] = count;
  }

  const { error } = await sb.from(GAMIFICATION_TABLE).update(updatePayload).eq('user_id', userId);
  if (error) throw new Error(`Error sincronizando logros: ${error.message}`);

  if (newlyUnlocked.length > 0) {
    await awardAchievementRewardsServer(userId, newlyUnlocked);
  }

  return { newlyUnlocked };
}
