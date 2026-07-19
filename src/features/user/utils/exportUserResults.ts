import { getProgress, getStoredExams, getStoredPractices } from '@/storage/progressStorage';
import type { AttemptWithQuestions, ProgressData } from '@/storage/progressStorageTypes';

export const USER_RESULTS_EXPORT_VERSION = 1 as const;

/** Serializable snapshot of the user's practice/exam results (client-owned data). */
export type UserResultsExport = {
  version: typeof USER_RESULTS_EXPORT_VERSION;
  exportedAt: string;
  progress: ProgressData | null;
  practices: AttemptWithQuestions[];
  exams: AttemptWithQuestions[];
};

export function buildUserResultsExport(now: Date = new Date()): UserResultsExport {
  return {
    version: USER_RESULTS_EXPORT_VERSION,
    exportedAt: now.toISOString(),
    progress: getProgress(),
    practices: getStoredPractices(),
    exams: getStoredExams(),
  };
}

export function userResultsExportFilename(now: Date = new Date()): string {
  const stamp = now.toISOString().slice(0, 10);
  return `icfes-master-resultados-${stamp}.json`;
}

/** Triggers a JSON download in the browser. No-op outside `window`. */
export function downloadUserResultsExport(now: Date = new Date()): UserResultsExport {
  const payload = buildUserResultsExport(now);
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return payload;
  }

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = userResultsExportFilename(now);
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  return payload;
}
