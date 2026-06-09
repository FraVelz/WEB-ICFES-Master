/**
 * Unified persistence layer (Supabase + client progress cache).
 * Prefer this module in features/UI instead of `@/storage` directly.
 */
export { isSupabaseConfigured } from './supabaseConfigured';
export { clearLocalClientData } from './clearLocalClientData';
export { gamificationPersistence } from './gamificationPersistence';
export {
  loadStreakState,
  recordStreakToday,
  mergeDemoStreakIntoUser,
  getStreakScope,
  STREAK_UPDATED_EVENT,
  type StreakScope,
} from './streakPersistence';
export { mergeDemoIntoUser, hasDemoDataToMigrate } from '@/services/demo/mergeDemoIntoUser';
export { getCoinsBalance, addCoinsBalance, spendCoinsBalance, COINS_CHANGE_EVENT } from './coinsPersistence';
export { loadProgressViewState, resetProgressData, type ProgressViewState } from './progressPersistence';
export { getExamById, resetUserExams, getUserExamsList } from './examPersistence';
export {
  loadUserProfile,
  patchUserProfile,
  setUsername,
  setUserBio,
  setUserProfileImage,
  addUserMoney,
  spendUserMoney,
} from './userPersistence';
export { getAggregatedUserData } from './userDataBundle';
export {
  getAssessmentScope,
  getAssessmentOptionsFromContext,
  persistLevelAssessment,
  hasCompletedLevelAssessment,
  loadPersistedSkillLevel,
  resolveLevelAssessmentRedirect,
} from './skillLevelPersistence';

export type { UserProfile, UserRank, RankInfo } from '@/features/user/types/userProfile.types';
export { getPerformanceRank } from '@/features/user/utils/performanceRank';

export {
  getProgress,
  getStoredExams,
  getStoredPractices,
  savePractice,
  saveFullExam,
  getCompletedLessons,
  markLessonAsCompleted,
  clearAllData,
  type ProgressData,
  type AttemptWithQuestions,
} from '@/storage/progressStorage';

export { formatTimeExtended } from '@/storage/timeFormatter';
