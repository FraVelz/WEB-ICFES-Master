import { IDLE_MS, type StudyTimeState } from './studyTimeTypes';

export function currentSessionSeconds(state: StudyTimeState, now: number): number {
  if (!state.sessionStartedAt) return 0;
  const end = state.lastActivityAt ?? now;
  return Math.max(0, Math.floor((end - state.sessionStartedAt) / 1000));
}

export function applySessionProgress(state: StudyTimeState, now: number): StudyTimeState {
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

export function closeSession(state: StudyTimeState, now: number): StudyTimeState {
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

export function isSessionActive(state: StudyTimeState, now: number): boolean {
  return Boolean(
    state.sessionStartedAt && state.lastActivityAt && now - state.lastActivityAt <= IDLE_MS
  );
}
