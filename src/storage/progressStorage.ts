/**
 * Progress and exams in **localStorage** (client-only).
 * Not a substitute for server persistence; see
 * `docs/es/data/progreso-cliente-local.md` (EN: `docs/en/data/client-local-progress.md`).
 */

export type { AreaStatItem, AttemptWithQuestions, ProgressData } from './progressStorageTypes';
export { LESSON_COMPLETED_EVENT, PROGRESS_UPDATED_EVENT } from './progressStorageTypes';
export { syncAchievementsAfterGameplay } from './progressAchievementSync';
export { getCompletedLessons, markLessonAsCompleted } from './progressLessonStorage';
export { getStoredExams, getStoredPractices } from './progressAttemptRead';
export { saveFullExam, savePractice } from './progressAttemptStorage';
export { updateProgress } from './progressCompute';
export { getDefaultProgress } from './progressDefaults';
export { getProgress, clearAllData, clearExamsOnly, getRecommendations } from './progressMaintenance';
