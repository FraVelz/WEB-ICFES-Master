import type { SupabaseClient } from '@supabase/supabase-js';
import { mapExamResultRowToAttempt } from '@/services/exam/examSyncService';
import { buildProfileCourseProgress } from '@/features/user/services/profileCourseProgressBuild';
import type { ProfileCourseProgressSnapshot } from '@/features/user/types/profileCourseProgress';
import type { LocalAttemptRecord } from '@/services/demo/mapLocalAttemptToExamResult';

export async function fetchPublicCourseProgress(
  sb: SupabaseClient,
  userId: string
): Promise<ProfileCourseProgressSnapshot> {
  const { data, error } = await sb
    .from('exam_results')
    .select('id, exam_type, completed_at, correct_answers, score, total_questions, questions')
    .eq('user_id', userId);

  if (error) {
    console.error('public profile course progress:', error.message);
    return buildProfileCourseProgress({
      lessonsByArea: {},
      completedLessonIds: [],
      skippedSectionIdsByArea: {},
      attempts: [],
      phasesAvailable: false,
    });
  }

  const attempts = (data ?? []).map((row) =>
    mapExamResultRowToAttempt(row as Record<string, unknown>)
  ) as LocalAttemptRecord[];

  return buildProfileCourseProgress({
    lessonsByArea: {},
    completedLessonIds: [],
    skippedSectionIdsByArea: {},
    attempts,
    phasesAvailable: false,
  });
}
