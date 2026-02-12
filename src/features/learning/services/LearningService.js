import { BASICO_TOPICS, INTERMEDIO_TOPICS } from '../data/roadmapData';
import { getCompletedLessons } from '@/shared/utils/progressStorage';

const AREA_MAP = { 'sociales-ciudadanas': 'sociales' };

/**
 * Servicio de aprendizaje - Versión local con datos estáticos
 * Preparado para futura implementación de backend
 */
export const LearningService = {
  getLearningPath: async (areaId) => {
    const key = AREA_MAP[areaId] || areaId;
    const basics = BASICO_TOPICS[key] || [];
    const intermedio = INTERMEDIO_TOPICS[key];
    const lessons = [
      ...basics.map((t, i) => ({
        id: `${key}_basico_${i}`,
        title: t.title,
        order: i,
        difficulty: 'facil',
        rewards: { xp: 50, coins: 25 },
        duration: t.duration,
        content: t.content
      })),
      ...(intermedio ? [{
        id: `${key}_intermedio`,
        title: intermedio.title,
        order: basics.length,
        difficulty: 'intermedio',
        rewards: { xp: 100, coins: 50 },
        description: intermedio.description,
        questions: intermedio.questions
      }] : [])
    ];
    return lessons;
  },

  getUserProgress: async (userId, areaId) => {
    const completed = getCompletedLessons();
    return { completedLessons: completed, currentLevel: 0, totalXP: 0 };
  }
};
