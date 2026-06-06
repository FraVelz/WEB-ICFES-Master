/**
 * Progress and exams in **localStorage** (client-only).
 * Not a substitute for server persistence; see
 * `docs/es/data/progreso-cliente-local.md` (EN: `docs/en/data/client-local-progress.md`).
 */

import {
  calculateCurrentStreak,
  datesFromAttemptIsoStrings,
  mergeStreakStates,
} from '@/services/streak/streakUtils';
import { loadLocalStreakState } from '@/services/streak/streakLocalStorage';
import { resolveStreakScopeFromStorage, recordStreakToday } from '@/services/streak/streakService';
import { STREAK_UPDATED_EVENT } from '@/services/streak';
import { DEMO_USER_ID } from '@/services/demo/demoCoins';
import { syncAchievementsFromGameplay } from '@/services/achievements/achievementProgressService';

export interface AreaStatItem {
  name: string;
  correct: number;
  total: number;
  percentage: number;
  icon: string;
  color: string;
}

export interface ProgressData {
  totalAttempts: number;
  totalQuestions: number;
  totalCorrect: number;
  percentage: number;
  streakDays: number;
  lastAttemptDate: string | null;
  bestArea?: AreaStatItem | null;
  weakArea?: AreaStatItem | null;
  areaStats: Record<string, AreaStatItem>;
}

interface AttemptQuestion {
  id: string;
  areaLabel?: string;
  correctAnswer: string;
}

export interface AttemptWithQuestions {
  id?: string | number;
  questions?: AttemptQuestion[];
  answers?: Record<string, string>;
  date?: string;
}

const STORAGE_KEYS = {
  EXAMS: 'icfes_exams',
  PRACTICE: 'icfes_practice',
  PROGRESS: 'icfes_progress',
  COMPLETED_LESSONS: 'icfes_completed_lessons',
};

export const getCompletedLessons = (): string[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.COMPLETED_LESSONS);
  return stored ? JSON.parse(stored) : [];
};

export const markLessonAsCompleted = (_userId: string, lessonId: string): void => {
  const completed = getCompletedLessons();
  if (!completed.includes(lessonId)) completed.push(lessonId);
  localStorage.setItem(STORAGE_KEYS.COMPLETED_LESSONS, JSON.stringify(completed));
  void syncAchievementsAfterGameplay();
};

function syncAchievementsAfterGameplay(): void {
  const scope = resolveStreakScopeFromStorage();
  if (!scope) return;
  const userId = scope === 'demo' ? DEMO_USER_ID : scope;
  void syncAchievementsFromGameplay(userId).then(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(STREAK_UPDATED_EVENT));
    }
  });
}

/**
 * Load stored full exams
 */
export const getStoredExams = (): AttemptWithQuestions[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.EXAMS);
  return stored ? JSON.parse(stored) : [];
};

/**
 * Persist a new full exam attempt
 */
export const saveFullExam = (
  examData: Record<string, unknown>
): AttemptWithQuestions & { id: number; type: string; date: string } => {
  const exams = getStoredExams();
  const newExam = {
    id: Date.now(),
    type: 'full-exam',
    date: new Date().toISOString(),
    ...examData,
  };
  exams.push(newExam);
  localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
  void recordStreakToday(resolveStreakScopeFromStorage()).then(() => {
    updateProgress();
    syncAchievementsAfterGameplay();
  });
  return newExam;
};

/**
 * Load stored practice attempts
 */
export const getStoredPractices = (): AttemptWithQuestions[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.PRACTICE);
  return stored ? JSON.parse(stored) : [];
};

/**
 * Persist a new practice attempt
 */
export const savePractice = (
  practiceData: Record<string, unknown>
): AttemptWithQuestions & { id: number; type: string; date: string } => {
  const practices = getStoredPractices();
  const newPractice = {
    id: Date.now(),
    type: 'practice',
    date: new Date().toISOString(),
    ...practiceData,
  };
  practices.push(newPractice);
  localStorage.setItem(STORAGE_KEYS.PRACTICE, JSON.stringify(practices));
  void recordStreakToday(resolveStreakScopeFromStorage()).then(() => {
    updateProgress();
    syncAchievementsAfterGameplay();
  });
  return newPractice;
};

/**
 * Recompute and store aggregate progress
 */
export const updateProgress = (): ProgressData => {
  const exams = getStoredExams();
  const practices = getStoredPractices();

  const allAttempts: AttemptWithQuestions[] = [...exams, ...practices];

  if (allAttempts.length === 0) {
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    return getDefaultProgress();
  }

  // Aggregate totals
  let totalQuestions = 0;
  let totalCorrect = 0;
  const areaStats: Record<string, { total: number; correct: number }> = {
    Matemáticas: { total: 0, correct: 0 },
    'Lectura Crítica': { total: 0, correct: 0 },
    'Ciencias Naturales': { total: 0, correct: 0 },
    'Sociales y Ciudadanas': { total: 0, correct: 0 },
  };

  allAttempts.forEach((attempt: AttemptWithQuestions) => {
    const { questions = [], answers = {} } = attempt;

    questions.forEach((question: AttemptQuestion) => {
      const areaLabel = question.areaLabel || 'Desconocido';
      totalQuestions++;

      if (areaStats[areaLabel]) {
        areaStats[areaLabel].total++;
      }

      if (answers[question.id] === question.correctAnswer) {
        totalCorrect++;
        if (areaStats[areaLabel]) {
          areaStats[areaLabel].correct++;
        }
      }
    });
  });

  // Study streak (calendar days) — aligned with streakService
  const scope = resolveStreakScopeFromStorage();
  const attemptDates = datesFromAttemptIsoStrings(allAttempts.map((a) => a.date));
  const streakState = mergeStreakStates(
    loadLocalStreakState('demo'),
    scope !== 'demo' ? loadLocalStreakState(scope) : { dates: [], longestStreak: 0 },
    { dates: attemptDates, longestStreak: 0 }
  );
  const streakDays = calculateCurrentStreak(streakState.dates);

  const progress: ProgressData = {
    totalAttempts: allAttempts.length,
    totalQuestions,
    totalCorrect,
    percentage: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
    streakDays,
    lastAttemptDate: allAttempts[allAttempts.length - 1]?.date || new Date().toISOString(),
    areaStats: {
      matematicas: {
        name: 'Matemáticas',
        correct: areaStats['Matemáticas'].correct,
        total: areaStats['Matemáticas'].total,
        percentage:
          areaStats['Matemáticas'].total > 0
            ? Math.round((areaStats['Matemáticas'].correct / areaStats['Matemáticas'].total) * 100)
            : 0,
        icon: 'faRuler',
        color: 'from-yellow-500 to-yellow-600',
      },
      lenguaje: {
        name: 'Lectura Crítica',
        correct: areaStats['Lectura Crítica'].correct,
        total: areaStats['Lectura Crítica'].total,
        percentage:
          areaStats['Lectura Crítica'].total > 0
            ? Math.round((areaStats['Lectura Crítica'].correct / areaStats['Lectura Crítica'].total) * 100)
            : 0,
        icon: 'faBook',
        color: 'from-blue-500 to-blue-600',
      },
      ciencias: {
        name: 'Ciencias Naturales',
        correct: areaStats['Ciencias Naturales'].correct,
        total: areaStats['Ciencias Naturales'].total,
        percentage:
          areaStats['Ciencias Naturales'].total > 0
            ? Math.round((areaStats['Ciencias Naturales'].correct / areaStats['Ciencias Naturales'].total) * 100)
            : 0,
        icon: 'faFlask',
        color: 'from-green-500 to-green-600',
      },
      sociales: {
        name: 'Sociales y Ciudadanas',
        correct: areaStats['Sociales y Ciudadanas'].correct,
        total: areaStats['Sociales y Ciudadanas'].total,
        percentage:
          areaStats['Sociales y Ciudadanas'].total > 0
            ? Math.round((areaStats['Sociales y Ciudadanas'].correct / areaStats['Sociales y Ciudadanas'].total) * 100)
            : 0,
        icon: 'faGlobe',
        color: 'from-orange-500 to-orange-600',
      },
    },
  };

  // Best and weakest areas (by %)
  const areas = Object.values(progress.areaStats).filter((a: AreaStatItem) => a.total > 0);
  if (areas.length > 0) {
    progress.bestArea = areas.reduce<AreaStatItem>(
      (prev, current) => (prev.percentage > current.percentage ? prev : current),
      areas[0]
    );
    progress.weakArea = areas.reduce<AreaStatItem>(
      (prev, current) => (prev.percentage < current.percentage ? prev : current),
      areas[0]
    );
  }

  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  return progress;
};

/**
 * Load stored aggregate progress
 */
export const getProgress = (): ProgressData => {
  const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  return stored ? JSON.parse(stored) : getDefaultProgress();
};

/**
 * Empty progress snapshot
 */
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
    areaStats: {
      matematicas: {
        name: 'Matemáticas',
        correct: 0,
        total: 0,
        percentage: 0,
        icon: 'faRuler',
        color: 'from-yellow-500 to-yellow-600',
      },
      lenguaje: {
        name: 'Lectura Crítica',
        correct: 0,
        total: 0,
        percentage: 0,
        icon: 'faBook',
        color: 'from-blue-500 to-blue-600',
      },
      ciencias: {
        name: 'Ciencias Naturales',
        correct: 0,
        total: 0,
        percentage: 0,
        icon: 'faFlask',
        color: 'from-green-500 to-green-600',
      },
      sociales: {
        name: 'Sociales y Ciudadanas',
        correct: 0,
        total: 0,
        percentage: 0,
        icon: 'faGlobe',
        color: 'from-orange-500 to-orange-600',
      },
    },
  };
};

/**
 * Clear exams, practice, and progress keys
 */
export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.EXAMS);
  localStorage.removeItem(STORAGE_KEYS.PRACTICE);
  localStorage.removeItem(STORAGE_KEYS.PROGRESS);
};

/**
 * Clear full exams only (recomputes progress)
 */
export const clearExamsOnly = (): void => {
  localStorage.removeItem(STORAGE_KEYS.EXAMS);
  updateProgress();
};

/**
 * Tip strings derived from progress data
 */
export const getRecommendations = (progress: ProgressData): string[] => {
  const recommendations: string[] = [];

  if (progress.weakArea) {
    recommendations.push(`Enfócate en fortalecer ${progress.weakArea.name} para mejorar tu promedio`);
  }

  if (progress.streakDays > 0 && progress.streakDays < 7) {
    recommendations.push(
      `Mantén tu racha de estudio diario - ¡Solo ${progress.streakDays} ${progress.streakDays === 1 ? 'día' : 'días'}! Puedes alcanzar más`
    );
  } else if (progress.streakDays === 0) {
    recommendations.push('¡Comienza tu racha de estudio hoy! Realiza al menos un examen o práctica');
  }

  recommendations.push('Revisa las explicaciones de preguntas incorrectas para aprender');

  recommendations.push('Realiza simulacros completos para prepararte mejor');

  return recommendations;
};
