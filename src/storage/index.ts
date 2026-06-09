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

export { formatTimeExtended } from './timeFormatter';
