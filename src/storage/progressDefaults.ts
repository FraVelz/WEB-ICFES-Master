import { buildDefaultAreaStats } from './progressAreaStats';
import type { ProgressData } from './progressStorageTypes';

export const getDefaultProgress = (): ProgressData => {
  return {
    totalAttempts: 0,
    totalQuestions: 0,
    totalCorrect: 0,
    percentage: 0,
    streakDays: 0,
    lastAttemptDate: null,
    bestArea: null,
    weakArea: null,
    areaStats: buildDefaultAreaStats(),
  };
};
