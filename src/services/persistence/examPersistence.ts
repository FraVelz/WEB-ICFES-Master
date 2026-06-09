/**
 * Exámenes / intentos — Supabase sync + fallback local.
 */
import ExamSupabaseService from '@/services/supabase/ExamSupabaseService';
import { isDemoUserId } from '@/services/demo/demoCoins';
import {
  fetchRemoteAttempts,
  mergeAttemptHistories,
  syncAttemptToSupabase,
  rebuildUserProgress,
} from '@/services/exam/examSyncService';
import type { LocalAttemptRecord } from '@/services/demo/mapLocalAttemptToExamResult';
import { getStoredExams, getStoredPractices, clearExamsOnly, type AttemptWithQuestions } from '@/storage/progressStorage';
import { isSupabaseConfigured } from './supabaseConfigured';

function useRemoteExams(userId: string | undefined): userId is string {
  return Boolean(userId && isSupabaseConfigured() && !isDemoUserId(userId));
}

export { syncAttemptToSupabase, rebuildUserProgress };

export async function getExamById(examId: string, userId: string | undefined): Promise<unknown> {
  if (useRemoteExams(userId)) {
    const remote = await ExamSupabaseService.getById(examId);
    if (remote) return remote;
  }
  const exams = getStoredExams();
  const practices = getStoredPractices();
  return (
    [...exams, ...practices].find((e: AttemptWithQuestions) => String(e.id) === examId) ?? null
  );
}

export async function resetUserExams(userId: string | undefined): Promise<void> {
  if (useRemoteExams(userId)) {
    await ExamSupabaseService.resetUserExams(userId);
    await rebuildUserProgress(userId);
  }
  clearExamsOnly();
}

export async function getUserExamsList(userId: string | undefined): Promise<unknown> {
  if (!useRemoteExams(userId)) {
    return getStoredExams();
  }

  const remote = await fetchRemoteAttempts(userId);
  const local = getStoredExams();
  return mergeAttemptHistories(userId, local, remote).filter((a) => (a as { type?: string }).type === 'full-exam');
}

export async function getMergedAttemptHistory(userId: string): Promise<AttemptWithQuestions[]> {
  if (!useRemoteExams(userId)) {
    const exams = getStoredExams();
    const practices = getStoredPractices();
    return [...exams, ...practices]
      .sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime())
      .slice(0, 50);
  }

  const remote = await fetchRemoteAttempts(userId);
  const local = [...getStoredExams(), ...getStoredPractices()];
  return mergeAttemptHistories(userId, local, remote);
}

export async function syncSavedAttempt(userId: string | undefined, attempt: LocalAttemptRecord): Promise<void> {
  if (!useRemoteExams(userId)) return;
  await syncAttemptToSupabase(userId, attempt);
}
