import { BASICO_TOPICS, INTERMEDIO_TOPICS } from '../data/roadmapData';
import { getStaticRoadmapDataKey } from '@/features/learning/constants/roadmapAreaKeys';
import {
  normalizeLessonPhase,
  phaseToSectionId,
  type LearningPhaseNumber,
} from '@/features/learning/constants/learningPhases';
import { ensureLearningProgressSynced } from '@/services/learning';
import { injectPhaseMinimumRequirements } from '@/features/learning/utils/injectPhaseMinimumRequirements';
import { injectBlockCheckpoints } from '@/features/learning/utils/injectBlockCheckpoints';
import { getLessonRewardsForPhase } from '@/features/learning/utils/lessonRewards';
import { getLearningPathFromCatalog } from '@/services/learning/learningCatalogCache';
import { getCompletedLessons } from '@/services/persistence';
import { getBlockExamPasses } from '@/services/persistence/blockExamPersistence';
import LearningSupabaseService from '@/services/supabase/LearningSupabaseService';
import type { AreaId } from '@/shared/constants';

interface TopicItem {
  title?: string;
  duration?: string;
  content?: string;
  [key: string]: unknown;
}

interface IntermedioTopic {
  title?: string;
  description?: string;
  questions?: unknown;
  [key: string]: unknown;
}

export interface LearningPathLesson {
  id: string;
  title?: unknown;
  order: number;
  phase: LearningPhaseNumber;
  difficulty: string;
  moduleType?: string;
  type?: string;
  blockId?: string;
  lessonIds?: string[];
  rewards: { xp?: number; coins?: number };
  duration?: unknown;
  content?: string;
  description?: unknown;
  questions?: unknown;
  quiz?: unknown;
  xp?: number;
  coins?: number;
}

function mapStaticLesson(
  partial: Omit<LearningPathLesson, 'phase' | 'difficulty'> & { phase?: LearningPhaseNumber }
): LearningPathLesson {
  const phase = partial.phase ?? 1;
  return {
    ...partial,
    phase,
    difficulty: phaseToSectionId(phase),
  };
}

/**
 * Learning data: Supabase when configured, otherwise static roadmap JSON
 */
function finalizeLearningPath(areaId: string, lessons: LearningPathLesson[], phase?: LearningPhaseNumber) {
  const withRequirements = injectPhaseMinimumRequirements(areaId, lessons, phase);
  return injectBlockCheckpoints(areaId, withRequirements, phase);
}

export const LearningService = {
  getLearningPath: async (areaId: string, phase?: LearningPhaseNumber): Promise<LearningPathLesson[]> => {
    const fromCatalog = await getLearningPathFromCatalog(areaId as AreaId, phase);
    if (fromCatalog.length > 0) return finalizeLearningPath(areaId, fromCatalog, phase);

    const lessons = await LearningSupabaseService.getLessonsByArea(areaId, phase);
    if (lessons?.length > 0) {
      const mapped = lessons.map((lesson, i) => {
        const l = lesson as Record<string, unknown>;
        const nestedContent = l.content;
        const rawContent =
          l.body ??
          l.markdown ??
          (typeof nestedContent === 'string'
            ? nestedContent
            : nestedContent && typeof nestedContent === 'object'
              ? ((nestedContent as Record<string, unknown>).body ?? (nestedContent as Record<string, unknown>).markdown)
              : undefined);
        const contentStr = typeof rawContent === 'string' ? rawContent : '';
        const lessonPhase = normalizeLessonPhase(l.phase ?? l.difficulty);
        return mapStaticLesson({
          id: String(l.id ?? `${areaId}_${i}`),
          title: l.title,
          order: i,
          phase: lessonPhase,
          rewards: getLessonRewardsForPhase(lessonPhase),
          duration: l.duration,
          content: contentStr,
          questions: l.questions,
          quiz: l.quiz,
        });
      });
      return finalizeLearningPath(areaId, mapped, phase);
    }

    const key = getStaticRoadmapDataKey(areaId);
    const basics = (BASICO_TOPICS as Record<string, TopicItem[]>)[key] ?? [];
    const intermedio = (INTERMEDIO_TOPICS as Record<string, IntermedioTopic>)[key];

    const staticLessons: LearningPathLesson[] = [
      ...basics.map((t: TopicItem, i: number) =>
        mapStaticLesson({
          id: `${key}_basico_${i}`,
          title: t.title,
          order: i,
          phase: 1,
          rewards: getLessonRewardsForPhase(1),
          duration: t.duration,
          content: t.content,
        })
      ),
      ...(intermedio
        ? [
            mapStaticLesson({
              id: `${key}_intermedio`,
              title: intermedio.title,
              order: basics.length,
              phase: 2,
              rewards: getLessonRewardsForPhase(2),
              description: intermedio.description,
              questions: intermedio.questions,
            }),
          ]
        : []),
    ];

    const filtered = phase === undefined ? staticLessons : staticLessons.filter((lesson) => lesson.phase === phase);
    return finalizeLearningPath(areaId, filtered, phase);
  },

  getUserProgress: async (userId: string, _areaId: string) => {
    if (userId) {
      const synced = await ensureLearningProgressSynced(userId);
      return {
        completedLessons: synced.completedLessons,
        blockExamPasses: synced.blockExamPasses,
        currentLevel: 0,
        totalXP: 0,
      };
    }
    return {
      completedLessons: getCompletedLessons(),
      blockExamPasses: getBlockExamPasses(),
      currentLevel: 0,
      totalXP: 0,
    };
  },
};
