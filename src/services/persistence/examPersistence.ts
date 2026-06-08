/**
 * Exámenes / intentos — lectura Supabase + fallback local.
 */
import ExamSupabaseService from '@/services/supabase/ExamSupabaseService';
import { isDemoUserId } from '@/services/demo/demoCoins';
import { getStoredExams, clearExamsOnly, type AttemptWithQuestions } from '@/storage/progressStorage';
import { isSupabaseConfigured } from './supabaseConfigured';

function useRemoteExams(userId: string | undefined): userId is string {
  return Boolean(userId && isSupabaseConfigured() && !isDemoUserId(userId));
}

export async function getExamById(examId: string, userId: string | undefined): Promise<unknown> {
  if (useRemoteExams(userId)) {
    return ExamSupabaseService.getById(examId);
  }
  const exams = getStoredExams();
  return exams.find((e: AttemptWithQuestions) => String(e.id) === examId) ?? null;
}

export async function resetUserExams(userId: string | undefined): Promise<void> {
  if (useRemoteExams(userId)) {
    await ExamSupabaseService.resetUserExams(userId);
  }
  clearExamsOnly();
}

export async function getUserExamsList(userId: string | undefined): Promise<unknown> {
  if (useRemoteExams(userId)) {
    return ExamSupabaseService.getByUserId(userId);
  }
  return getStoredExams();
}
