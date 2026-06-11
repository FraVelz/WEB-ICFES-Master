import { updateProgress } from './progressCompute';
import { getDefaultProgress } from './progressDefaults';
import type { ProgressData } from './progressStorageTypes';
import { STORAGE_KEYS } from './progressStorageTypes';

/** Load stored aggregate progress */
export const getProgress = (): ProgressData => {
  const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  return stored ? JSON.parse(stored) : getDefaultProgress();
};

/** Clear exams, practice, and progress keys */
export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.EXAMS);
  localStorage.removeItem(STORAGE_KEYS.PRACTICE);
  localStorage.removeItem(STORAGE_KEYS.PROGRESS);
};

/** Clear full exams only (recomputes progress) */
export const clearExamsOnly = (): void => {
  localStorage.removeItem(STORAGE_KEYS.EXAMS);
  updateProgress();
};

/** Tip strings derived from progress data */
export const getRecommendations = (progress: ProgressData): string[] => {
  const recommendations: string[] = [];

  if (progress.weakArea) {
    recommendations.push(`Enfócate en fortalecer ${progress.weakArea.name} para mejorar tu promedio`);
  }

  if (progress.streakDays > 0 && progress.streakDays < 7) {
    recommendations.push(
      `Mantén tu racha de estudio diario - ¡Solo ${progress.streakDays} ` +
        `${progress.streakDays === 1 ? 'día' : 'días'}! Puedes alcanzar más`
    );
  } else if (progress.streakDays === 0) {
    recommendations.push('¡Comienza tu racha de estudio hoy! Realiza al menos un examen o práctica');
  }

  recommendations.push('Revisa las explicaciones de preguntas incorrectas para aprender');
  recommendations.push('Realiza simulacros completos para prepararte mejor');

  return recommendations;
};
