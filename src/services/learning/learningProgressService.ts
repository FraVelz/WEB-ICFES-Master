import { isDemoUserId } from '@/services/demo/demoCoins';
import { isSupabaseConfigured } from '@/services/persistence/supabaseConfigured';
import GamificationSupabaseService from '@/services/supabase/GamificationSupabaseService';
import {
  applyLearningProgressToLocal,
  getLocalLearningProgress,
  readLearningProgressRemoteMeta,
} from './learningProgressLocal';
import { learningProgressEqual, mergeLearningProgress } from './learningProgressMerge';
import {
  LEARNING_PROGRESS_META_KEY,
  LEARNING_PROGRESS_UPDATED_EVENT,
  type LearningProgressSnapshot,
} from './learningProgressTypes';

const syncCache = new Map<string, Promise<LearningProgressSnapshot>>();

export function notifyLearningProgressUpdated(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(LEARNING_PROGRESS_UPDATED_EVENT));
}

export function invalidateLearningProgressSync(userId: string): void {
  syncCache.delete(userId);
}

async function fetchRemoteLearningProgress(userId: string): Promise<LearningProgressSnapshot> {
  const profile = await GamificationSupabaseService.getByUserId(userId);
  return readLearningProgressRemoteMeta(profile?.achievements);
}

async function writeRemoteLearningProgress(
  userId: string,
  snapshot: LearningProgressSnapshot,
  currentAchievements: Record<string, unknown>
): Promise<void> {
  await GamificationSupabaseService.updateAchievements(userId, {
    ...currentAchievements,
    [LEARNING_PROGRESS_META_KEY]: snapshot,
  });
}

export async function syncLearningProgressWithRemote(userId: string): Promise<LearningProgressSnapshot> {
  const local = getLocalLearningProgress();

  if (isDemoUserId(userId) || !isSupabaseConfigured()) {
    return local;
  }

  try {
    const profile = await GamificationSupabaseService.getByUserId(userId);
    const achievements =
      typeof profile?.achievements === 'object' &&
      profile?.achievements !== null &&
      !Array.isArray(profile.achievements)
        ? { ...(profile.achievements as Record<string, unknown>) }
        : {};

    const remote = readLearningProgressRemoteMeta(achievements);
    const merged = mergeLearningProgress(local, remote);

    if (!learningProgressEqual(local, merged)) {
      applyLearningProgressToLocal(merged);
    }

    if (!learningProgressEqual(remote, merged)) {
      await writeRemoteLearningProgress(userId, merged, achievements);
    }

    return merged;
  } catch (err) {
    console.warn('No se pudo sincronizar progreso de aprendizaje:', err);
    return local;
  }
}

export async function ensureLearningProgressSynced(userId: string): Promise<LearningProgressSnapshot> {
  const cached = syncCache.get(userId);
  if (cached) return cached;

  const promise = syncLearningProgressWithRemote(userId).finally(() => {
    syncCache.delete(userId);
  });
  syncCache.set(userId, promise);
  return promise;
}

export async function pushLearningProgressToRemote(userId: string): Promise<void> {
  invalidateLearningProgressSync(userId);
  await syncLearningProgressWithRemote(userId);
  notifyLearningProgressUpdated();
}

export function getCompletedLessonsLocal(): string[] {
  return getLocalLearningProgress().completedLessons;
}
