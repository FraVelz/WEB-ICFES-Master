export type { StreakScope, StreakState } from './streakTypes';
export {
  STREAK_UPDATED_EVENT,
  DEMO_STREAK_KEY,
  getStreakScope,
  getUserStreakKey,
  resolveStorageKey,
} from './streakTypes';
export { calculateCurrentStreak, calculateLongestStreak, getLocalDateString, mergeStreakStates } from './streakUtils';
export {
  loadStreakState,
  saveStreakState,
  recordStreakToday,
  recordStreakForScope,
  mergeDemoStreakIntoUser,
  backfillStreakFromAttempts,
  getStreakMetrics,
  getActiveStreakUserId,
  setActiveStreakUserId,
  resolveStreakScopeFromStorage,
} from './streakService';
export { loadLocalStreakState } from './streakLocalStorage';
