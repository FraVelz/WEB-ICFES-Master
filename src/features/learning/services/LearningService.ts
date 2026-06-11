import { BASICO_TOPICS, INTERMEDIO_TOPICS } from '../data/roadmapData';
import { getStaticRoadmapDataKey } from '@/features/learning/constants/roadmapAreaKeys';
import {
  normalizeLessonPhase,
  phaseToSectionId,
  type LearningPhaseNumber,
} from '@/features/learning/constants/learningPhases';
import { ensureLearningProgressSynced } from '@/services/learning';
import { getCompletedLessons } from '@/services/persistence';
import LearningSupabaseService from '@/services/supabase/LearningSupabaseService';

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
export const LearningService = {
  getLearningPath: async (areaId: string, phase?: LearningPhaseNumber): Promise<LearningPathLesson[]> => {
    const lessons = await LearningSupabaseService.getLessonsByArea(areaId, phase);
    if (lessons?.length > 0) {
      return lessons.map((lesson, i) => {
        const l = lesson as Record<string, unknown>;
        const quiz = (l.quiz ?? {}) as Record<string, unknown>;
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
          rewards: (quiz.rewards as { xp?: number; coins?: number }) || { xp: 50, coins: 25 },
          duration: l.duration,
          content: contentStr,
          questions: l.questions,
          quiz: l.quiz,
        });
      });
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
          rewards: { xp: 50, coins: 25 },
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
              rewards: { xp: 100, coins: 50 },
              description: intermedio.description,
              questions: intermedio.questions,
            }),
          ]
        : []),
    ];

    if (phase === undefined) return staticLessons;
    return staticLessons.filter((lesson) => lesson.phase === phase);
  },

  getUserProgress: async (userId: string, _areaId: string) => {
    const completed = userId
      ? (await ensureLearningProgressSynced(userId)).completedLessons
      : getCompletedLessons();
    return { completedLessons: completed, currentLevel: 0, totalXP: 0 };
  },
};
