/**
 * Local storage layer. Features/UI should prefer `@/services/persistence`.
 */
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
} from './progressStorage';

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
} from './userProfile';

export { formatTimeExtended } from './timeFormatter';
