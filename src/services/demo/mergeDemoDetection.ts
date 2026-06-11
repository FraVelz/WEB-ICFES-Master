import { getStoredExams, getStoredPractices } from '@/storage/progressStorage';

export const DEMO_COINS_KEY = 'icfes_demo_coins';
export const DEMO_GAMIFICATION_KEY = 'icfes_demo_gamification';

export function hasDemoDataToMigrate(): boolean {
  if (typeof window === 'undefined') return false;

  if (localStorage.getItem('demoMode') === 'true') return true;
  if (localStorage.getItem(DEMO_COINS_KEY) != null) return true;
  if (localStorage.getItem(DEMO_GAMIFICATION_KEY) != null) return true;
  if (localStorage.getItem('icfes_achievement_progress_demo') != null) return true;
  if (localStorage.getItem('icfes_lectura_read_demo') != null) return true;
  if (localStorage.getItem('icfes_streak_dates') != null) return true;
  if (localStorage.getItem('icfes_level_assessment_done_demo') === 'true') return true;
  if (getStoredExams().length > 0 || getStoredPractices().length > 0) {
    return localStorage.getItem('demoMode') === 'true';
  }

  return false;
}

export function clearDemoLocalStorageAfterMigration(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(DEMO_COINS_KEY);
  localStorage.removeItem(DEMO_GAMIFICATION_KEY);
  localStorage.removeItem('icfes_achievement_progress_demo');
  localStorage.removeItem('icfes_lectura_read_demo');
  localStorage.removeItem('icfes_skill_level_demo');
  localStorage.removeItem('icfes_level_assessment_done_demo');
  localStorage.removeItem('icfes_level_assessment_meta_demo');
  localStorage.removeItem('icfes_study_time_demo');
}
