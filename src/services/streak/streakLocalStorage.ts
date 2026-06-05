import type { StreakScope, StreakState } from './streakTypes';
import { DEMO_STREAK_KEY, resolveStorageKey } from './streakTypes';
import { parseStoredStreak, serializeStreakState } from './streakUtils';

function readKey(key: string): StreakState {
  if (typeof window === 'undefined') return { dates: [], longestStreak: 0 };
  return parseStoredStreak(localStorage.getItem(key));
}

function writeKey(key: string, state: StreakState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, serializeStreakState(state));
}

export function loadLocalStreakState(scope: StreakScope): StreakState {
  return readKey(resolveStorageKey(scope));
}

export function saveLocalStreakState(scope: StreakScope, state: StreakState): void {
  writeKey(resolveStorageKey(scope), state);
}

export function clearLocalStreakState(scope: StreakScope): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(resolveStorageKey(scope));
}

export function clearDemoStreakLocal(): void {
  clearLocalStreakState('demo');
}

export function loadDemoStreakFromLegacyKey(): StreakState {
  return readKey(DEMO_STREAK_KEY);
}
