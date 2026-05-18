/**
 * Unified persistence: Supabase or localStorage via API_CONFIG.
 * Prefer this module in features/UI instead of `@/storage` directly.
 */
export * from './apiMode';
export * from './gamificationPersistence';
export * from './progressPersistence';
export * from './examPersistence';
export * from './userPersistence';
export { getAggregatedUserData } from './userDataBundle';

// Client storage helpers (local mode / legacy direct access)
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
