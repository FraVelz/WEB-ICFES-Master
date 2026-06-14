import type { ExamConfig } from '@/features/exam/types';

const STORAGE_KEY = 'icfes-full-exam-pending-config';

export function savePendingFullExamConfig(config: ExamConfig): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function consumePendingFullExamConfig(): ExamConfig | null {
  if (typeof window === 'undefined') return null;

  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  sessionStorage.removeItem(STORAGE_KEY);

  try {
    const parsed = JSON.parse(raw) as ExamConfig;
    if (typeof parsed.numQuestions !== 'number' || parsed.numQuestions < 1) return null;
    return parsed;
  } catch {
    return null;
  }
}
