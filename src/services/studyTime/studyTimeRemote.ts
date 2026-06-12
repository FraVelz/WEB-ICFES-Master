import { syncAchievementsFromGameplay } from '@/services/achievements/achievementProgressService';
import { notifyGamificationUpdatedIfNeeded } from '@/services/achievements/gamificationUpdatedEvents';
import { isDemoUserId } from '@/services/demo/demoCoins';
import { isSupabaseConfigured } from '@/services/persistence/supabaseConfigured';
import GamificationSupabaseService from '@/services/supabase/GamificationSupabaseService';
import { getStudyTimeStats } from './studyTimeStats';
import { STUDY_TIME_META_KEY, STUDY_TIME_UPDATED_EVENT, type StudyTimeRemoteMeta, type StudyTimeStats } from './studyTimeTypes';

export function notifyStudyTimeUpdated(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(STUDY_TIME_UPDATED_EVENT));
}

function readRemoteStudyTimeMeta(achievements: Record<string, unknown>): StudyTimeRemoteMeta | null {
  const raw = achievements[STUDY_TIME_META_KEY];
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const meta = raw as Record<string, unknown>;
  return {
    totalMinutes: Number(meta.totalMinutes ?? 0),
    longestSessionMinutes: Number(meta.longestSessionMinutes ?? 0),
  };
}

function studyTimeMetaEqual(a: StudyTimeStats, b: StudyTimeRemoteMeta | null): boolean {
  if (!b) return false;
  return a.totalMinutes === b.totalMinutes && a.longestSessionMinutes === b.longestSessionMinutes;
}

export async function syncStudyTimeRemote(userId: string, stats: StudyTimeStats): Promise<boolean> {
  if (isDemoUserId(userId) || !isSupabaseConfigured()) return false;

  try {
    const profile = await GamificationSupabaseService.getAchievementsMetaByUserId(userId);
    const achievements =
      typeof profile?.achievements === 'object' &&
      profile?.achievements !== null &&
      !Array.isArray(profile.achievements)
        ? { ...(profile.achievements as Record<string, unknown>) }
        : {};

    const remoteMeta = readRemoteStudyTimeMeta(achievements);
    if (studyTimeMetaEqual(stats, remoteMeta)) return false;

    achievements[STUDY_TIME_META_KEY] = {
      totalMinutes: stats.totalMinutes,
      longestSessionMinutes: stats.longestSessionMinutes,
    };

    await GamificationSupabaseService.updateAchievements(userId, achievements);
    return true;
  } catch (err) {
    console.warn('No se pudo sincronizar tiempo de estudio:', err);
    return false;
  }
}

export async function maybeSyncAchievements(userId: string, previousLongestMinutes: number): Promise<void> {
  const stats = getStudyTimeStats(userId);

  if (stats.longestSessionMinutes <= previousLongestMinutes) return;

  await syncStudyTimeRemote(userId, stats);
  const { progressChanged, hadNewUnlocks } = await syncAchievementsFromGameplay(userId);
  notifyGamificationUpdatedIfNeeded({ progressChanged, hadNewUnlocks });
  notifyStudyTimeUpdated();
}
