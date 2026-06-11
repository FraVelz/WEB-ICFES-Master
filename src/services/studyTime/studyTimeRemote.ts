import { syncAchievementsFromGameplay } from '@/services/achievements/achievementProgressService';
import { isDemoUserId } from '@/services/demo/demoCoins';
import { isSupabaseConfigured } from '@/services/persistence/supabaseConfigured';
import GamificationSupabaseService from '@/services/supabase/GamificationSupabaseService';
import { getStudyTimeStats } from './studyTimeStats';
import { STUDY_TIME_META_KEY, STUDY_TIME_UPDATED_EVENT, type StudyTimeStats } from './studyTimeTypes';

export function notifyStudyTimeUpdated(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(STUDY_TIME_UPDATED_EVENT));
}

export async function syncStudyTimeRemote(userId: string, stats: StudyTimeStats): Promise<void> {
  if (isDemoUserId(userId) || !isSupabaseConfigured()) return;

  try {
    const profile = await GamificationSupabaseService.getByUserId(userId);
    const achievements =
      typeof profile?.achievements === 'object' &&
      profile?.achievements !== null &&
      !Array.isArray(profile.achievements)
        ? { ...(profile.achievements as Record<string, unknown>) }
        : {};

    achievements[STUDY_TIME_META_KEY] = {
      totalMinutes: stats.totalMinutes,
      longestSessionMinutes: stats.longestSessionMinutes,
    };

    await GamificationSupabaseService.updateAchievements(userId, achievements);
  } catch (err) {
    console.warn('No se pudo sincronizar tiempo de estudio:', err);
  }
}

export async function maybeSyncAchievements(userId: string, previousLongestMinutes: number): Promise<void> {
  const stats = getStudyTimeStats(userId);
  await syncStudyTimeRemote(userId, stats);

  if (stats.longestSessionMinutes <= previousLongestMinutes) return;

  await syncAchievementsFromGameplay(userId);
  notifyStudyTimeUpdated();
}
