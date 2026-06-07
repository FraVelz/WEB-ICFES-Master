import { BASICO_TOPICS, INTERMEDIO_TOPICS } from '../data/roadmapData';
import { getStaticRoadmapDataKey } from '@/features/learning/constants/roadmapAreaKeys';
import { getCompletedLessons } from '@/services/persistence';
import API_CONFIG from '@/services/api.config';
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

/**
 * Learning data: Supabase when configured, otherwise static roadmap JSON
 */
export const LearningService = {
  getLearningPath: async (areaId: string): Promise<LearningPathLesson[]> => {
    if (API_CONFIG.MODE === 'supabase') {
      const lessons = await LearningSupabaseService.getLessonsByArea(areaId);
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
                ? ((nestedContent as Record<string, unknown>).body ??
                  (nestedContent as Record<string, unknown>).markdown)
                : undefined);
          const contentStr = typeof rawContent === 'string' ? rawContent : '';
          return {
            id: String(l.id ?? `${areaId}_${i}`),
            title: l.title,
            order: i,
            difficulty: String(l.difficulty || 'facil'),
            rewards: (quiz.rewards as { xp?: number; coins?: number }) || { xp: 50, coins: 25 },
            duration: l.duration,
            content: contentStr,
            questions: l.questions,
            quiz: l.quiz,
          } satisfies LearningPathLesson;
        });
      }
    }

    const key = getStaticRoadmapDataKey(areaId);
    const basics = (BASICO_TOPICS as Record<string, TopicItem[]>)[key] ?? [];
    const intermedio = (INTERMEDIO_TOPICS as Record<string, IntermedioTopic>)[key];
    return [
      ...basics.map(
        (t: TopicItem, i: number) =>
          ({
            id: `${key}_basico_${i}`,
            title: t.title,
            order: i,
            difficulty: 'facil',
            rewards: { xp: 50, coins: 25 },
            duration: t.duration,
            content: t.content,
          }) satisfies LearningPathLesson
      ),
      ...(intermedio
        ? [
            {
              id: `${key}_intermedio`,
              title: intermedio.title,
              order: basics.length,
              difficulty: 'intermedio',
              rewards: { xp: 100, coins: 50 },
              description: intermedio.description,
              questions: intermedio.questions,
            } satisfies LearningPathLesson,
          ]
        : []),
    ];
  },

  getUserProgress: async (_userId: string, _areaId: string) => {
    const completed = getCompletedLessons();
    return { completedLessons: completed, currentLevel: 0, totalXP: 0 };
  },
};
