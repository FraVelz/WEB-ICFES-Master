import type { SupabaseClient } from '@supabase/supabase-js';
import { mapExamResultRowToAttempt } from '@/services/exam/examSyncService';
import { fetchPublishedLessonsByArea } from '@/services/learning/learningContentServer';
import {
  readLearningProgressRemoteMeta,
  skippedSectionIdsByAreaFromRecords,
} from '@/services/learning';
import { buildProfileCourseProgress } from '@/features/user/services/profileCourseProgressBuild';
import type { ProfileCourseProgressSnapshot } from '@/features/user/types/profileCourseProgress';
import { HOME_AREA_IDS, type AreaId } from '@/shared/constants';
import type { LocalAttemptRecord } from '@/services/demo/mapLocalAttemptToExamResult';

export async function fetchPublicCourseProgress(
  sb: SupabaseClient,
  userId: string
): Promise<ProfileCourseProgressSnapshot> {
  const [examResult, gamificationResult, lessonsByArea] = await Promise.all([
    sb
      .from('exam_results')
      .select('id, exam_type, completed_at, correct_answers, score, total_questions, questions')
      .eq('user_id', userId),
    sb.from('user_gamification').select('achievements').eq('user_id', userId).maybeSingle(),
    fetchPublishedLessonsByArea(sb),
  ]);

  if (examResult.error) {
    console.error('public profile course progress:', examResult.error.message);
  }

  const attempts = (examResult.data ?? []).map((row) =>
    mapExamResultRowToAttempt(row as Record<string, unknown>)
  ) as LocalAttemptRecord[];

  const learningProgress = readLearningProgressRemoteMeta(gamificationResult.data?.achievements);
  const skipMap = skippedSectionIdsByAreaFromRecords(learningProgress.phaseSkips);
  const skippedSectionIdsByArea = Object.fromEntries(
    HOME_AREA_IDS.map((areaId) => [areaId, skipMap[areaId] ?? new Set<string>()])
  ) as Partial<Record<AreaId, Set<string>>>;

  const hasLessonCatalog = HOME_AREA_IDS.some((areaId) => (lessonsByArea[areaId]?.length ?? 0) > 0);

  return buildProfileCourseProgress({
    lessonsByArea,
    completedLessonIds: learningProgress.completedLessons,
    skippedSectionIdsByArea,
    attempts,
    phasesAvailable: hasLessonCatalog,
  });
}
