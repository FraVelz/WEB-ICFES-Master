import { calculateCurrentStreak, datesFromAttemptIsoStrings, mergeStreakStates } from '@/services/streak/streakUtils';
import { loadLocalStreakState } from '@/services/streak/streakLocalStorage';
import { resolveStreakScopeFromStorage } from '@/services/streak/streakService';
import { getStoredExams, getStoredPractices } from './progressAttemptRead';
import { buildAreaStats, createEmptyAreaTotals, pickBestAndWeakAreas } from './progressAreaStats';
import { getDefaultProgress } from './progressDefaults';
import type { AttemptWithQuestions, ProgressData } from './progressStorageTypes';
import { PROGRESS_UPDATED_EVENT, STORAGE_KEYS } from './progressStorageTypes';

interface AttemptQuestion {
  id: string;
  areaLabel?: string;
  correctAnswer: string;
}

function aggregateAttempts(allAttempts: AttemptWithQuestions[]): {
  totalQuestions: number;
  totalCorrect: number;
  areaTotals: Record<string, { total: number; correct: number }>;
} {
  let totalQuestions = 0;
  let totalCorrect = 0;
  const areaTotals = createEmptyAreaTotals();

  allAttempts.forEach((attempt) => {
    const { questions = [], answers = {} } = attempt;
    questions.forEach((question: AttemptQuestion) => {
      const areaLabel = question.areaLabel || 'Desconocido';
      totalQuestions++;
      if (areaTotals[areaLabel]) areaTotals[areaLabel].total++;
      if (answers[question.id] === question.correctAnswer) {
        totalCorrect++;
        if (areaTotals[areaLabel]) areaTotals[areaLabel].correct++;
      }
    });
  });

  return { totalQuestions, totalCorrect, areaTotals };
}

function computeStreakDays(allAttempts: AttemptWithQuestions[]): number {
  const scope = resolveStreakScopeFromStorage();
  const attemptDates = datesFromAttemptIsoStrings(allAttempts.map((attempt) => attempt.date));
  const streakState = mergeStreakStates(
    loadLocalStreakState('demo'),
    scope !== 'demo' ? loadLocalStreakState(scope) : { dates: [], longestStreak: 0 },
    { dates: attemptDates, longestStreak: 0 }
  );
  return calculateCurrentStreak(streakState.dates);
}

export const updateProgress = (): ProgressData => {
  const allAttempts: AttemptWithQuestions[] = [...getStoredExams(), ...getStoredPractices()];

  if (allAttempts.length === 0) {
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    return getDefaultProgress();
  }

  const { totalQuestions, totalCorrect, areaTotals } = aggregateAttempts(allAttempts);
  const streakDays = computeStreakDays(allAttempts);
  const areaStats = buildAreaStats(areaTotals);
  const { bestArea, weakArea } = pickBestAndWeakAreas(areaStats);

  const progress: ProgressData = {
    totalAttempts: allAttempts.length,
    totalQuestions,
    totalCorrect,
    percentage: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
    streakDays,
    lastAttemptDate: allAttempts[allAttempts.length - 1]?.date || new Date().toISOString(),
    areaStats,
    bestArea,
    weakArea,
  };

  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(PROGRESS_UPDATED_EVENT));
  }
  return progress;
};
