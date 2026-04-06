import { BASICO_TOPICS, INTERMEDIO_TOPICS } from '../data/roadmapData';
import { getCompletedLessons } from '@/shared/utils/progressStorage';
import API_CONFIG from '@/services/api.config';
import LearningSupabaseService from '@/services/supabase/LearningSupabaseService';

const AREA_MAP: Record<string, string> = { 'sociales-ciudadanas': 'sociales' };

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

/**
 * Servicio de aprendizaje - Supabase o datos estáticos locales
 */
export const LearningService = {
  getLearningPath: async (areaId: string) => {
    if (API_CONFIG.MODE === 'supabase') {
      const lessons = await LearningSupabaseService.getLessonsByArea(areaId);
      if (lessons?.length > 0) {
        return lessons.map((l, i) => {
          // Extraer el contenido como string (body, markdown, content o content.body)
          const rawContent =
            l.body ??
            l.markdown ??
            (typeof l.content === 'string' ? l.content : (l.content?.body ?? l.content?.markdown));
          const contentStr = typeof rawContent === 'string' ? rawContent : '';
          return {
            id: l.id,
            title: l.title,
            order: i,
            difficulty: l.difficulty || 'facil',
            rewards: l.quiz?.rewards || { xp: 50, coins: 25 },
            duration: l.duration,
            content: contentStr,
            questions: l.questions,
            quiz: l.quiz,
          };
        });
      }
    }

    const key = AREA_MAP[areaId] ?? areaId;
    const basics = (BASICO_TOPICS as Record<string, TopicItem[]>)[key] ?? [];
    const intermedio = (INTERMEDIO_TOPICS as Record<string, IntermedioTopic>)[key];
    return [
      ...basics.map((t: TopicItem, i: number) => ({
        id: `${key}_basico_${i}`,
        title: t.title,
        order: i,
        difficulty: 'facil',
        rewards: { xp: 50, coins: 25 },
        duration: t.duration,
        content: t.content,
      })),
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
            },
          ]
        : []),
    ];
  },

  getUserProgress: async (userId: string, areaId: string) => {
    const completed = getCompletedLessons();
    return { completedLessons: completed, currentLevel: 0, totalXP: 0 };
  },
};
