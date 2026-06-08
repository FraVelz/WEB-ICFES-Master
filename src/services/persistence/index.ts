/**
 * Unified persistence layer (Supabase + client progress cache).
 * Prefer this module in features/UI instead of `@/storage` directly.
 */
export { isSupabaseConfigured } from './supabaseConfigured';
export { gamificationPersistence } from './gamificationPersistence';
export {
  loadStreakState,
  recordStreakToday,
  mergeDemoStreakIntoUser,
  getStreakScope,
  STREAK_UPDATED_EVENT,
  type StreakScope,
} from './streakPersistence';
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
  persistLevelAssessment,
  hasCompletedLevelAssessment,
  loadPersistedSkillLevel,
} from './skillLevelPersistence';

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

export {
  clearLocalUserData,
  getUserProfile,
  getUserRank,
  updateUserProfile,
  updateUsername,
  updateUserBio,
  updateProfileImage,
  getVirtualMoney,
  addVirtualMoney,
  removeVirtualMoney,
  type UserProfile,
  type UserRank,
} from '@/storage/userProfile';

export { formatTimeExtended } from '@/storage/timeFormatter';
