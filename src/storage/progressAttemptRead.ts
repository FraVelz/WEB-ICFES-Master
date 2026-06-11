import type { AttemptWithQuestions } from './progressStorageTypes';
import { STORAGE_KEYS } from './progressStorageTypes';

export const getStoredExams = (): AttemptWithQuestions[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.EXAMS);
  return stored ? JSON.parse(stored) : [];
};

export const getStoredPractices = (): AttemptWithQuestions[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.PRACTICE);
  return stored ? JSON.parse(stored) : [];
};
