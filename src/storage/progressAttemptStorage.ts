import type { LocalAttemptRecord } from '@/services/demo/mapLocalAttemptToExamResult';
import { resolveStreakScopeFromStorage, recordStreakToday } from '@/services/streak/streakService';
import { syncAchievementsAfterGameplay } from './progressAchievementSync';
import { updateProgress } from './progressCompute';
import { getStoredExams, getStoredPractices } from './progressAttemptRead';
import type { AttemptWithQuestions } from './progressStorageTypes';
import { STORAGE_KEYS } from './progressStorageTypes';

type SavedAttempt = AttemptWithQuestions & { id: number; type: string; date: string };

async function syncAttemptToServer(scope: string, attempt: SavedAttempt, correctCount: number): Promise<void> {
  if (scope === 'demo') return;
  void import('@/services/persistence/examPersistence').then(({ syncSavedAttempt }) =>
    syncSavedAttempt(scope, attempt as LocalAttemptRecord)
  );
  const xpModule =
    attempt.type === 'full-exam'
      ? import('@/services/league/activityXp').then(({ awardFullExamXp }) => awardFullExamXp(scope, correctCount))
      : import('@/services/league/activityXp').then(({ awardPracticeXp }) => awardPracticeXp(scope, correctCount));
  void xpModule;
}

function persistAttempt(
  storageKey: string,
  type: 'full-exam' | 'practice',
  data: Record<string, unknown>
): SavedAttempt {
  const stored = storageKey === STORAGE_KEYS.EXAMS ? getStoredExams() : getStoredPractices();
  const newAttempt: SavedAttempt = {
    id: Date.now(),
    type,
    date: new Date().toISOString(),
    ...data,
  };
  stored.push(newAttempt);
  localStorage.setItem(storageKey, JSON.stringify(stored));

  const scope = resolveStreakScopeFromStorage();
  void recordStreakToday(scope).then(() => {
    updateProgress();
    syncAchievementsAfterGameplay();
  });

  const correctCount = Number(data.correctCount ?? 0);
  void syncAttemptToServer(scope ?? 'demo', newAttempt, correctCount);

  return newAttempt;
}

export const saveFullExam = (examData: Record<string, unknown>): SavedAttempt => {
  return persistAttempt(STORAGE_KEYS.EXAMS, 'full-exam', examData);
};

export const savePractice = (practiceData: Record<string, unknown>): SavedAttempt => {
  return persistAttempt(STORAGE_KEYS.PRACTICE, 'practice', practiceData);
};
