import { DEMO_USER_ID, isDemoUserId } from '@/services/demo/demoCoins';
import { syncAchievementsFromGameplay } from '@/services/achievements/achievementProgressService';
import { isSupabaseConfigured } from '@/services/persistence/supabaseConfigured';
import GamificationSupabaseService from '@/services/supabase/GamificationSupabaseService';
import { resolveStreakScopeFromStorage } from '@/services/streak/streakService';
import { secondsToDisplayMinutes } from '@/services/studyTime/studyTimeUtils';

export const STUDY_TIME_UPDATED_EVENT = 'icfes-study-time-updated';
export const STUDY_TIME_META_KEY = '_studyTime';
export const MARATHON_TARGET_MINUTES = 120;
const IDLE_MS = 5 * 60 * 1000;
const ACTIVITY_THROTTLE_MS = 10_000;

export interface StudyTimeState {
  totalSeconds: number;
  longestSessionSeconds: number;
  sessionStartedAt: number | null;
  lastActivityAt: number | null;
}

export interface StudyTimeStats {
  totalMinutes: number;
  longestSessionMinutes: number;
  currentSessionMinutes: number;
}

export interface StudyTimeRemoteMeta {
  totalMinutes: number;
  longestSessionMinutes: number;
}

const activityThrottle = new Map<string, number>();

/** Solo para tests — evita que el throttle de un caso afecte al siguiente. */
export function resetStudyTimeActivityThrottleForTests(): void {
  activityThrottle.clear();
}

function storageKey(userId: string): string {
  return `icfes_study_time_${userId}`;
}

function emptyState(): StudyTimeState {
  return {
    totalSeconds: 0,
    longestSessionSeconds: 0,
    sessionStartedAt: null,
    lastActivityAt: null,
  };
}

export function resolveStudyTimeUserId(authUserId?: string | null, demoMode?: boolean): string | null {
  if (authUserId && authUserId !== DEMO_USER_ID) return authUserId;
  if (demoMode) return DEMO_USER_ID;
  const scope = resolveStreakScopeFromStorage({ userId: authUserId, isDemo: demoMode });
  return scope === 'demo' ? DEMO_USER_ID : scope;
}

export function loadStudyTimeState(userId: string): StudyTimeState {
  if (typeof window === 'undefined') return emptyState();

  const stored = localStorage.getItem(storageKey(userId));
  if (!stored) return emptyState();

  try {
    const parsed = JSON.parse(stored) as Partial<StudyTimeState>;
    return {
      totalSeconds: Number(parsed.totalSeconds ?? 0),
      longestSessionSeconds: Number(parsed.longestSessionSeconds ?? 0),
      sessionStartedAt: parsed.sessionStartedAt ?? null,
      lastActivityAt: parsed.lastActivityAt ?? null,
    };
  } catch {
    return emptyState();
  }
}

export function saveStudyTimeState(userId: string, state: StudyTimeState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(storageKey(userId), JSON.stringify(state));
}

function notifyStudyTimeUpdated(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(STUDY_TIME_UPDATED_EVENT));
}

function currentSessionSeconds(state: StudyTimeState, now: number): number {
  if (!state.sessionStartedAt) return 0;
  const end = state.lastActivityAt ?? now;
  return Math.max(0, Math.floor((end - state.sessionStartedAt) / 1000));
}

function applySessionProgress(state: StudyTimeState, now: number): StudyTimeState {
  if (!state.sessionStartedAt || !state.lastActivityAt) return state;

  const deltaSeconds = Math.max(0, Math.floor((now - state.lastActivityAt) / 1000));
  if (deltaSeconds === 0) return state;

  const sessionSeconds = currentSessionSeconds(state, now);
  return {
    ...state,
    totalSeconds: state.totalSeconds + deltaSeconds,
    longestSessionSeconds: Math.max(state.longestSessionSeconds, sessionSeconds),
    lastActivityAt: now,
  };
}

function closeSession(state: StudyTimeState, now: number): StudyTimeState {
  let next = state;

  if (state.sessionStartedAt && state.lastActivityAt && now - state.lastActivityAt <= IDLE_MS) {
    next = applySessionProgress(state, now);
  }

  if (next.sessionStartedAt) {
    const sessionSeconds = currentSessionSeconds(next, now);
    next = {
      ...next,
      longestSessionSeconds: Math.max(next.longestSessionSeconds, sessionSeconds),
      sessionStartedAt: null,
      lastActivityAt: null,
    };
  }

  return next;
}

export function getStudyTimeStats(userId: string): StudyTimeStats {
  const state = loadStudyTimeState(userId);
  const now = Date.now();
  const activeSessionSeconds =
    state.sessionStartedAt && state.lastActivityAt && now - state.lastActivityAt <= IDLE_MS
      ? currentSessionSeconds(state, now)
      : 0;

  return {
    totalMinutes: secondsToDisplayMinutes(state.totalSeconds + activeSessionSeconds),
    longestSessionMinutes: Math.min(
      MARATHON_TARGET_MINUTES,
      secondsToDisplayMinutes(Math.max(state.longestSessionSeconds, activeSessionSeconds))
    ),
    currentSessionMinutes: secondsToDisplayMinutes(activeSessionSeconds),
  };
}

export function readStudyTimeRemoteMeta(rawAchievements: unknown): StudyTimeRemoteMeta {
  if (typeof rawAchievements !== 'object' || rawAchievements === null || Array.isArray(rawAchievements)) {
    return { totalMinutes: 0, longestSessionMinutes: 0 };
  }

  const meta = (rawAchievements as Record<string, unknown>)[STUDY_TIME_META_KEY];
  if (typeof meta !== 'object' || meta === null || Array.isArray(meta)) {
    return { totalMinutes: 0, longestSessionMinutes: 0 };
  }

  return {
    totalMinutes: Number((meta as StudyTimeRemoteMeta).totalMinutes ?? 0),
    longestSessionMinutes: Number((meta as StudyTimeRemoteMeta).longestSessionMinutes ?? 0),
  };
}

async function syncStudyTimeRemote(userId: string, stats: StudyTimeStats): Promise<void> {
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

async function maybeSyncAchievements(userId: string, previousLongestMinutes: number): Promise<void> {
  const stats = getStudyTimeStats(userId);
  await syncStudyTimeRemote(userId, stats);

  if (stats.longestSessionMinutes <= previousLongestMinutes) return;

  await syncAchievementsFromGameplay(userId);
  notifyStudyTimeUpdated();
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
    state = {
      ...state,
      sessionStartedAt: now,
      lastActivityAt: now,
    };
  } else {
    state = applySessionProgress(state, now);
  }

  saveStudyTimeState(userId, state);
  notifyStudyTimeUpdated();
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
    await syncAchievementsFromGameplay(userId);
  }
}

export function mergeStudyTimeStates(base: StudyTimeState, incoming: StudyTimeState): StudyTimeState {
  return {
    totalSeconds: Math.max(base.totalSeconds, incoming.totalSeconds),
    longestSessionSeconds: Math.max(base.longestSessionSeconds, incoming.longestSessionSeconds),
    sessionStartedAt: null,
    lastActivityAt: null,
  };
}

export async function mergeDemoStudyTimeIntoUser(userId: string): Promise<void> {
  if (typeof window === 'undefined') return;

  const merged = mergeStudyTimeStates(loadStudyTimeState(DEMO_USER_ID), loadStudyTimeState(userId));
  saveStudyTimeState(userId, merged);
  localStorage.removeItem(storageKey(DEMO_USER_ID));

  const stats = getStudyTimeStats(userId);
  await syncStudyTimeRemote(userId, stats);
}
