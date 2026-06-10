import { mapLocalAttemptToExamResult, type LocalAttemptRecord } from '@/services/demo/mapLocalAttemptToExamResult';
import { rebuildUserProgress } from '@/services/exam/examSyncService';
import { isSupabaseConfigured } from '@/services/persistence/supabaseConfigured';
import ExamSupabaseService from '@/services/supabase/ExamSupabaseService';
import { getStoredExams, getStoredPractices } from '@/storage/progressStorage';

/** Sube intentos locales a `exam_results` con IDs deterministas (idempotente). */
export async function migrateLocalAttemptsToSupabase(userId: string): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  const attempts: LocalAttemptRecord[] = [...getStoredExams(), ...getStoredPractices()] as LocalAttemptRecord[];
  if (attempts.length === 0) return 0;

  const results = await Promise.all(
    attempts.map(async (attempt) => {
      try {
        const row = mapLocalAttemptToExamResult(userId, attempt);
        return (await ExamSupabaseService.insertMigratedAttempt(row)) ? 1 : 0;
      } catch (err) {
        console.warn('No se pudo migrar un intento del demo:', err);
        return 0;
      }
    })
  );
  const inserted = results.reduce<number>((total, count) => total + count, 0);

  if (attempts.length > 0) {
    await rebuildUserProgress(userId);
  }

  return inserted;
}
