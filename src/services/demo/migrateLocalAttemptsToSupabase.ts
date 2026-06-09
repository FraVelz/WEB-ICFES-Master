import { mapLocalAttemptToExamResult, type LocalAttemptRecord } from '@/services/demo/mapLocalAttemptToExamResult';
import { isSupabaseConfigured } from '@/services/persistence/supabaseConfigured';
import ExamSupabaseService from '@/services/supabase/ExamSupabaseService';
import { getStoredExams, getStoredPractices } from '@/storage/progressStorage';

/** Sube intentos locales a `exam_results` con IDs deterministas (idempotente). */
export async function migrateLocalAttemptsToSupabase(userId: string): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  const attempts: LocalAttemptRecord[] = [...getStoredExams(), ...getStoredPractices()] as LocalAttemptRecord[];
  if (attempts.length === 0) return 0;

  let inserted = 0;

  for (const attempt of attempts) {
    try {
      const row = mapLocalAttemptToExamResult(userId, attempt);
      const created = await ExamSupabaseService.insertMigratedAttempt(row);
      if (created) inserted += 1;
    } catch (err) {
      console.warn('No se pudo migrar un intento del demo:', err);
    }
  }

  return inserted;
}
