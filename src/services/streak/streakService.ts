import GamificationSupabaseService from '@/services/supabase/GamificationSupabaseService';
import { isSupabaseConfigured } from '@/services/persistence/supabaseConfigured';
import {
  consumeStreakShields,
  getStreakShieldCount,
} from '@/services/persistence/streakShieldPersistence';
import { DEMO_USER_ID } from '@/services/demo/demoCoins';
import { getStoredExams, getStoredPractices } from '@/storage/progressStorage';

import { clearDemoStreakLocal, loadLocalStreakState, saveLocalStreakState } from './streakLocalStorage';
import type { StreakScope, StreakState } from './streakTypes';
import { getStreakScope, STREAK_UPDATED_EVENT } from './streakTypes';
import {
  calculateCurrentStreak,
  datesFromAttemptIsoStrings,
  findMissedStreakDayToProtect,
  getLocalDateString,
  mergeStreakStates,
  withUpdatedLongest,
} from './streakUtils';

function notifyStreakUpdated(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(STREAK_UPDATED_EVENT));
}

async function loadRemoteStreak(userId: string): Promise<StreakState | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    return await GamificationSupabaseService.getStreak(userId);
  } catch {
    return null;
  }
}

async function persistStreak(scope: StreakScope, state: StreakState): Promise<StreakState> {
  const normalized = withUpdatedLongest(state);
  saveLocalStreakState(scope, normalized);

  if (scope !== 'demo' && isSupabaseConfigured()) {
    try {
      await GamificationSupabaseService.updateStreak(scope, normalized);
    } catch (err) {
      console.warn('No se pudo persistir racha en Supabase:', err);
    }
  }

  notifyStreakUpdated();
  return normalized;
}

function resolveShieldUserId(scope: StreakScope): string {
  return scope === 'demo' ? DEMO_USER_ID : scope;
}

async function applyStreakProtectorsIfNeeded(scope: StreakScope, state: StreakState): Promise<StreakState> {
  const userId = resolveShieldUserId(scope);
  let dates = [...state.dates];
  const shields = await getStreakShieldCount(userId);
  const filledDays: string[] = [];
  let remainingShields = shields;

  while (remainingShields > 0) {
    const missedDay = findMissedStreakDayToProtect(dates);
    if (!missedDay) break;
    dates = [...dates, missedDay];
    filledDays.push(missedDay);
    remainingShields -= 1;
  }

  if (filledDays.length === 0) return state;

  await consumeStreakShields(userId, filledDays.length);
  return persistStreak(scope, { ...state, dates });
}

/** Load streak: merge local + remote for authenticated users in Supabase mode. */
export async function loadStreakState(scope: StreakScope): Promise<StreakState> {
  const local = loadLocalStreakState(scope);

  let state: StreakState;
  if (scope === 'demo') {
    state = local;
  } else {
    const remote = await loadRemoteStreak(scope);
    if (remote) {
      const merged = mergeStreakStates(local, remote);
      saveLocalStreakState(scope, merged);
      state = merged;
    } else {
      state = local;
    }
  }

  return applyStreakProtectorsIfNeeded(scope, state);
}

export async function saveStreakState(scope: StreakScope, state: StreakState): Promise<StreakState> {
  return persistStreak(scope, state);
}

export function getActiveStreakUserId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('icfes_active_streak_user');
}

export function setActiveStreakUserId(userId: string | null): void {
  if (typeof window === 'undefined') return;
  if (userId) localStorage.setItem('icfes_active_streak_user', userId);
  else localStorage.removeItem('icfes_active_streak_user');
}

/** Resolve scope for streak writes outside React (exam save, etc.). */
export function resolveStreakScopeFromStorage(options?: { userId?: string | null; isDemo?: boolean }): StreakScope {
  const scoped = getStreakScope(options?.userId, options?.isDemo);
  if (scoped) return scoped;

  const active = getActiveStreakUserId();
  if (active) return active;

  return 'demo';
}

export async function recordStreakForScope(scope: StreakScope): Promise<StreakState> {
  return recordStreakToday(scope);
}

/** Idempotent: mark today as an active streak day. */
export async function recordStreakToday(scope: StreakScope): Promise<StreakState> {
  const current = await loadStreakState(scope);
  const today = getLocalDateString();
  if (current.dates.includes(today)) {
    return current;
  }
  return persistStreak(scope, { ...current, dates: [...current.dates, today] });
}

/** Merge demo streak into authenticated user (call on signup/login). */
export async function mergeDemoStreakIntoUser(userId: string): Promise<StreakState> {
  const demoState = loadLocalStreakState('demo');
  const userLocal = loadLocalStreakState(userId);
  const remote = (await loadRemoteStreak(userId)) ?? { dates: [], longestStreak: 0 };

  const merged = mergeStreakStates(demoState, userLocal, remote);
  const saved = await persistStreak(userId, merged);
  clearDemoStreakLocal();
  return saved;
}

/** One-time backfill from exam/practice attempts when dates are empty. */
export async function backfillStreakFromAttempts(scope: StreakScope): Promise<StreakState | null> {
  const current = loadLocalStreakState(scope);
  if (current.dates.length > 0) return null;

  const attempts = [...getStoredExams(), ...getStoredPractices()];
  const derivedDates = datesFromAttemptIsoStrings(attempts.map((a) => a.date));
  if (derivedDates.length === 0) return null;

  return persistStreak(scope, mergeStreakStates(current, { dates: derivedDates, longestStreak: 0 }));
}

export function getStreakMetrics(state: StreakState): {
  currentStreak: number;
  longestStreak: number;
  dates: string[];
} {
  const dates = state.dates;
  const currentStreak = calculateCurrentStreak(dates);
  const longestStreak = Math.max(state.longestStreak, currentStreak);
  return { currentStreak, longestStreak, dates };
}
