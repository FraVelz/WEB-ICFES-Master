'use client';

import { useCallback, useEffect, useState } from 'react';
import { LearningService } from '@/features/learning/services/LearningService';
import { HOME_AREA_IDS, type AreaId } from '@/shared/constants';
import {
  ensureLearningProgressSynced,
  LEARNING_PROGRESS_UPDATED_EVENT,
  skippedSectionIdsByAreaFromRecords,
} from '@/services/learning';
import { getMergedAttemptHistory } from '@/services/persistence/examPersistence';
import { PHASE_SKIP_UPDATED_EVENT } from '@/services/persistence/phaseSkipPersistence';
import { LESSON_COMPLETED_EVENT } from '@/services/persistence';
import { buildProfileCourseProgress } from '../services/profileCourseProgressBuild';
import {
  EMPTY_PROFILE_COURSE_PROGRESS,
  type ProfileCourseProgressSnapshot,
} from '../types/profileCourseProgress';
import type { LocalAttemptRecord } from '@/services/demo/mapLocalAttemptToExamResult';

export function useProfileCourseProgress(userId: string | undefined) {
  const [courseProgress, setCourseProgress] = useState<ProfileCourseProgressSnapshot>(EMPTY_PROFILE_COURSE_PROGRESS);
  const [loading, setLoading] = useState(Boolean(userId));

  const load = useCallback(async () => {
    if (!userId) {
      setCourseProgress(EMPTY_PROFILE_COURSE_PROGRESS);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [lessonsByAreaEntries, attempts, learningProgress] = await Promise.all([
        Promise.all(
          HOME_AREA_IDS.map(async (areaId) => {
            const lessons = await LearningService.getLearningPath(areaId);
            return [areaId, lessons] as const;
          })
        ),
        getMergedAttemptHistory(userId) as Promise<LocalAttemptRecord[]>,
        ensureLearningProgressSynced(userId),
      ]);

      const lessonsByArea = Object.fromEntries(lessonsByAreaEntries) as Partial<
        Record<AreaId, Awaited<ReturnType<typeof LearningService.getLearningPath>>>
      >;

      const skipMap = skippedSectionIdsByAreaFromRecords(learningProgress.phaseSkips);
      const skippedSectionIdsByArea = Object.fromEntries(
        HOME_AREA_IDS.map((areaId) => [areaId, skipMap[areaId] ?? new Set<string>()])
      ) as Partial<Record<AreaId, Set<string>>>;

      setCourseProgress(
        buildProfileCourseProgress({
          lessonsByArea,
          completedLessonIds: learningProgress.completedLessons,
          skippedSectionIdsByArea,
          attempts,
          phasesAvailable: true,
        })
      );
    } catch (err) {
      console.error('profile course progress:', err);
      setCourseProgress(EMPTY_PROFILE_COURSE_PROGRESS);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!userId) return;

    const refresh = () => void load();
    window.addEventListener(LESSON_COMPLETED_EVENT, refresh);
    window.addEventListener(PHASE_SKIP_UPDATED_EVENT, refresh);
    window.addEventListener(LEARNING_PROGRESS_UPDATED_EVENT, refresh);
    return () => {
      window.removeEventListener(LESSON_COMPLETED_EVENT, refresh);
      window.removeEventListener(PHASE_SKIP_UPDATED_EVENT, refresh);
      window.removeEventListener(LEARNING_PROGRESS_UPDATED_EVENT, refresh);
    };
  }, [userId, load]);

  return { courseProgress, loading, refresh: load };
}
