import { DEMO_USER_ID } from '@/services/demo/demoCoins';
import { syncAchievementsFromGameplay } from '@/services/achievements/achievementProgressService';
import { notifyGamificationUpdatedIfNeeded } from '@/services/achievements/gamificationUpdatedEvents';
import { ACTIVITY_THROTTLE_MS, IDLE_MS } from './studyTimeTypes';
import { maybeSyncAchievements, notifyStudyTimeUpdated, syncStudyTimeRemote } from './studyTimeRemote';
import { applySessionProgress, closeSession } from './studyTimeSession';
import { getStudyTimeStats } from './studyTimeStats';
import {
  loadStudyTimeState,
  mergeStudyTimeStates,
  removeStudyTimeStorage,
  saveStudyTimeState,
} from './studyTimeStorage';

const activityThrottle = new Map<string, number>();

/** Solo para tests — evita que el throttle de un caso afecte al siguiente. */
export function resetStudyTimeActivityThrottleForTests(): void {
  activityThrottle.clear();
}

export async function processStudyTimeActivity(userId: string, now = Date.now()): Promise<void> {
  const last = activityThrottle.get(userId) ?? 0;
  if (now - last < ACTIVITY_THROTTLE_MS) return;
  activityThrottle.set(userId, now);

  const previousLongest = getStudyTimeStats(userId).longestSessionMinutes;
  let state = loadStudyTimeState(userId);

  if (state.sessionStartedAt && state.lastActivityAt && now - state.lastActivityAt > IDLE_MS) {
    state = closeSession(state, state.lastActivityAt + IDLE_MS);
  }

  if (!state.sessionStartedAt) {
    state = { ...state, sessionStartedAt: now, lastActivityAt: now };
  } else {
    state = applySessionProgress(state, now);
  }

  saveStudyTimeState(userId, state);
  notifyStudyTimeUpdated();
  // Solo sincroniza remoto si se supera récord de sesión (evita egress cada 10 s).
  await maybeSyncAchievements(userId, previousLongest);
}

export async function finalizeStudyTimeSession(userId: string, now = Date.now()): Promise<void> {
  activityThrottle.delete(userId);

  const previousLongest = getStudyTimeStats(userId).longestSessionMinutes;
  const state = closeSession(loadStudyTimeState(userId), now);
  saveStudyTimeState(userId, state);
  notifyStudyTimeUpdated();

  const stats = getStudyTimeStats(userId);
  await syncStudyTimeRemote(userId, stats);

  if (stats.longestSessionMinutes > previousLongest) {
    const { progressChanged, hadNewUnlocks } = await syncAchievementsFromGameplay(userId);
    notifyGamificationUpdatedIfNeeded({ progressChanged, hadNewUnlocks });
  }
}

export async function mergeDemoStudyTimeIntoUser(userId: string): Promise<void> {
  if (typeof window === 'undefined') return;

  const merged = mergeStudyTimeStates(loadStudyTimeState(DEMO_USER_ID), loadStudyTimeState(userId));
  saveStudyTimeState(userId, merged);
  removeStudyTimeStorage(DEMO_USER_ID);

  const stats = getStudyTimeStats(userId);
  await syncStudyTimeRemote(userId, stats);
}
