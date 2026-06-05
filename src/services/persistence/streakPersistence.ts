/**
 * Streak persistence facade (local + Supabase via streakService).
 */
export {
  loadStreakState,
  saveStreakState,
  recordStreakToday,
  mergeDemoStreakIntoUser,
  backfillStreakFromAttempts,
  getStreakMetrics,
  getStreakScope,
  STREAK_UPDATED_EVENT,
  type StreakScope,
  type StreakState,
} from '@/services/streak';
