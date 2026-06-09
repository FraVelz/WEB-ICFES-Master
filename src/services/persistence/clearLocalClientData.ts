import { clearAllData } from '@/storage/progressStorage';

const LEGACY_KEYS = [
  'icfes_user_profile',
  'icfes_user_settings',
  'icfes_gamification',
  'icfes_mock_user',
  'icfes_demo_coins',
  'icfes_demo_gamification',
  'icfes_active_streak_user',
  'icfes_streak_dates',
  'icfes_completed_lessons',
  'demoMode',
];

/** Removes client-side progress, demo state, and legacy profile keys. */
export function clearLocalClientData(userId?: string | null): void {
  if (typeof window === 'undefined') return;

  clearAllData();

  for (const key of LEGACY_KEYS) {
    localStorage.removeItem(key);
  }

  if (userId) {
    localStorage.removeItem(`icfes_streak_dates_${userId}`);
    localStorage.removeItem(`icfes_achievement_progress_${userId}`);
    localStorage.removeItem(`icfes_skill_level_${userId}`);
    localStorage.removeItem(`icfes_level_assessment_done_${userId}`);
    localStorage.removeItem(`icfes_level_assessment_meta_${userId}`);
    localStorage.removeItem(`icfes_lectura_read_${userId}`);
    localStorage.removeItem(`icfes_study_time_${userId}`);
  }

  localStorage.removeItem('icfes_achievement_progress_demo');
  localStorage.removeItem('icfes_skill_level_demo');
  localStorage.removeItem('icfes_level_assessment_done_demo');
  localStorage.removeItem('icfes_level_assessment_meta_demo');
  localStorage.removeItem('icfes_lectura_read_demo');
  localStorage.removeItem('icfes_study_time_demo');

  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (!key) continue;
    if (
      key.startsWith('icfes_achievement_progress_') ||
      key.startsWith('icfes_streak_dates_') ||
      key.startsWith('icfes_study_time_')
    ) {
      localStorage.removeItem(key);
    }
  }
}
