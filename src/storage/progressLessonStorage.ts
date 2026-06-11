import { pushLearningProgressToRemote } from '@/services/learning';
import { LESSON_COMPLETED_EVENT, STORAGE_KEYS } from './progressStorageTypes';
import { syncAchievementsAfterGameplay } from './progressAchievementSync';

export const getCompletedLessons = (): string[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.COMPLETED_LESSONS);
  return stored ? JSON.parse(stored) : [];
};

export const markLessonAsCompleted = (userId: string, lessonId: string): void => {
  const completed = getCompletedLessons();
  if (!completed.includes(lessonId)) completed.push(lessonId);
  localStorage.setItem(STORAGE_KEYS.COMPLETED_LESSONS, JSON.stringify(completed));
  void syncAchievementsAfterGameplay();
  if (userId) {
    void pushLearningProgressToRemote(userId);
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(LESSON_COMPLETED_EVENT));
  }
};
