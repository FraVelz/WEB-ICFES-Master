import { COMPETENCY_PHASES } from '@/features/learning/data/competencyPhases';
import { isPhaseDone } from '@/features/learning/data/phaseProgressUtils';
import {
  buildPathSectionsFromLessons,
  countExamAttempts,
} from '@/features/user/services/profileCourseProgressBuild';
import { LearningService } from '@/features/learning/services/LearningService';
import { getLocalLearningProgress } from '@/services/learning/learningProgressLocal';
import { skippedSectionIdsByAreaFromRecords } from '@/services/learning';
import { phaseAchievementId } from '@/shared/constants/achievements/achievementsPhases';
import { HOME_AREA_IDS } from '@/shared/constants';
import type { LocalAttemptRecord } from '@/services/demo/mapLocalAttemptToExamResult';
import { getStoredPractices } from '@/storage/progressStorage';

export async function computePhaseAchievementMetrics(): Promise<Record<string, number>> {
  const { completedLessons, phaseSkips } = getLocalLearningProgress();
  const skippedByArea = skippedSectionIdsByAreaFromRecords(phaseSkips);
  const attempts = getStoredPractices() as LocalAttemptRecord[];
  const { areaGeneralByArea } = countExamAttempts(attempts);

  const metrics: Record<string, number> = {};

  await Promise.all(
    HOME_AREA_IDS.map(async (areaId) => {
      const lessons = await LearningService.getLearningPath(areaId);
      const sections = buildPathSectionsFromLessons(lessons, completedLessons);
      const skipped = skippedByArea[areaId] ?? new Set<string>();

      for (const phase of COMPETENCY_PHASES) {
        const section = sections.find((entry) => entry.id === phase.sectionId);
        const done = isPhaseDone(section, skipped, phase.sectionId);
        metrics[phaseAchievementId(phase.id, areaId)] = done ? 1 : 0;
      }

      const hasAreaSimulacro = (areaGeneralByArea[areaId] ?? 0) > 0;
      metrics[phaseAchievementId('simulacro', areaId)] = hasAreaSimulacro ? 1 : 0;
    })
  );

  return metrics;
}
