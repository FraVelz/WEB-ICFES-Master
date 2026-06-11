import { DEMO_USER_ID, isDemoUserId } from '@/services/demo/demoCoins';
import { gamificationPersistence } from '@/services/persistence/gamificationPersistence';
import { isSupabaseConfigured } from '@/services/persistence/supabaseConfigured';
import GamificationSupabaseService from '@/services/supabase/GamificationSupabaseService';
import { getStudyTimeStats, STUDY_TIME_META_KEY } from '@/services/studyTime/studyTimeService';
import { computeAchievementProgressFromGameplay } from './achievementProgressCompute';
import { mergeAchievementProgressMaps, progressMapsEqual } from './achievementProgressMerge';
import { awardNewUnlocks } from './achievementProgressRewards';
import {
  normalizeAchievementsRecord,
  readAchievementProgress,
  writeAchievementProgress,
} from './achievementProgressStorage';
import type { AchievementProgressMap, SyncAchievementsOptions } from './achievementProgressTypes';

async function loadRemoteAchievementProgress(userId: string): Promise<AchievementProgressMap> {
  if (isDemoUserId(userId) || !isSupabaseConfigured()) return {};

  try {
    const profile = await gamificationPersistence.getProfile(userId);
    return normalizeAchievementsRecord(profile?.achievements);
  } catch {
    return {};
  }
}

function attachStudyTimeMeta(userId: string, progress: AchievementProgressMap): Record<string, unknown> {
  const studyStats = getStudyTimeStats(userId);
  return {
    ...progress,
    [STUDY_TIME_META_KEY]: {
      totalMinutes: studyStats.totalMinutes,
      longestSessionMinutes: studyStats.longestSessionMinutes,
    },
  };
}

/**
 * Reconcilia logros desde gameplay + baseline (p. ej. demo) sin otorgar recompensas.
 * Usar en migración demo → cuenta para evitar duplicar monedas/XP.
 */
export async function reconcileAchievementsWithoutRewards(
  userId: string,
  extraBaseline: AchievementProgressMap = {}
): Promise<AchievementProgressMap> {
  const remote = await loadRemoteAchievementProgress(userId);
  const local = readAchievementProgress(userId);
  const demoBaseline = readAchievementProgress(DEMO_USER_ID);
  const baseline = mergeAchievementProgressMaps(
    remote,
    mergeAchievementProgressMaps(local, mergeAchievementProgressMaps(demoBaseline, extraBaseline))
  );
  const computed = await computeAchievementProgressFromGameplay(userId);
  const merged = mergeAchievementProgressMaps(baseline, computed);

  if (!isDemoUserId(userId) && isSupabaseConfigured()) {
    await GamificationSupabaseService.updateAchievements(userId, attachStudyTimeMeta(userId, merged));
  }
  writeAchievementProgress(userId, merged);

  return merged;
}

export async function syncAchievementsFromGameplay(
  userId: string,
  options: SyncAchievementsOptions = {}
): Promise<AchievementProgressMap> {
  const remote = options.remoteAchievements ?? (await loadRemoteAchievementProgress(userId));
  const local = readAchievementProgress(userId);
  const previous = mergeAchievementProgressMaps(remote, local);
  const computed = await computeAchievementProgressFromGameplay(userId, options);
  const next = mergeAchievementProgressMaps(previous, computed);

  await awardNewUnlocks(userId, previous, next);

  const progressChanged = !progressMapsEqual(previous, next);

  if (!isDemoUserId(userId) && isSupabaseConfigured() && progressChanged) {
    await GamificationSupabaseService.updateAchievements(userId, attachStudyTimeMeta(userId, next));
  }
  writeAchievementProgress(userId, next);

  return next;
}
