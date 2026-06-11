import { DEMO_USER_ID } from '@/services/demo/demoCoins';
import { resolveStreakScopeFromStorage } from '@/services/streak/streakService';
import type { StudyTimeState } from './studyTimeTypes';

function storageKey(userId: string): string {
  return `icfes_study_time_${userId}`;
}

export function emptyStudyTimeState(): StudyTimeState {
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
  if (typeof window === 'undefined') return emptyStudyTimeState();

  const stored = localStorage.getItem(storageKey(userId));
  if (!stored) return emptyStudyTimeState();

  try {
    const parsed = JSON.parse(stored) as Partial<StudyTimeState>;
    return {
      totalSeconds: Number(parsed.totalSeconds ?? 0),
      longestSessionSeconds: Number(parsed.longestSessionSeconds ?? 0),
      sessionStartedAt: parsed.sessionStartedAt ?? null,
      lastActivityAt: parsed.lastActivityAt ?? null,
    };
  } catch {
    return emptyStudyTimeState();
  }
}

export function saveStudyTimeState(userId: string, state: StudyTimeState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(storageKey(userId), JSON.stringify(state));
}

export function removeStudyTimeStorage(userId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(storageKey(userId));
}

export function mergeStudyTimeStates(base: StudyTimeState, incoming: StudyTimeState): StudyTimeState {
  return {
    totalSeconds: Math.max(base.totalSeconds, incoming.totalSeconds),
    longestSessionSeconds: Math.max(base.longestSessionSeconds, incoming.longestSessionSeconds),
    sessionStartedAt: null,
    lastActivityAt: null,
  };
}
