/**
 * Exámenes / intentos: una sola entrada para Supabase o localStorage.
 */
import ExamSupabaseService from '@/services/supabase/ExamSupabaseService';
import { getStoredExams, clearExamsOnly, type AttemptWithQuestions } from '@/shared/utils/progressStorage';
import { isSupabaseMode } from './apiMode';

export async function getExamById(examId: string, userId: string | undefined): Promise<unknown> {
  if (isSupabaseMode() && userId) {
    return ExamSupabaseService.getById(examId);
  }
  const exams = getStoredExams();
  return exams.find((e: AttemptWithQuestions) => String(e.id) === examId) ?? null;
}

export async function resetUserExams(userId: string | undefined): Promise<void> {
  if (isSupabaseMode() && userId) {
    await ExamSupabaseService.resetUserExams(userId);
    return;
  }
  clearExamsOnly();
}

export async function getUserExamsList(userId: string | undefined): Promise<unknown> {
  if (isSupabaseMode() && userId) {
    return ExamSupabaseService.getByUserId(userId);
  }
  return getStoredExams();
}
