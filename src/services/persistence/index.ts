/**
 * Unified persistence: Supabase or localStorage via API_CONFIG.
 * Prefer this module in features/UI instead of `@/storage` directly.
 */
export { API_CONFIG, isSupabaseMode, isLocalStorageMode } from './apiMode';
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
