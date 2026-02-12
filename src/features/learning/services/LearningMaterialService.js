/**
 * Servicio de materiales de aprendizaje - Versión local
 * Preparado para futura implementación de backend
 */
import { BASICO_TOPICS } from '../data/roadmapData';
import { getCompletedLessons, markLessonAsCompleted as markLesson } from '@/shared/utils/progressStorage';

const AREA_MAP = { 'sociales-ciudadanas': 'sociales' };

class LearningMaterialService {
  async getLessonsByArea(area) {
    const key = AREA_MAP[area] || area;
    const topics = BASICO_TOPICS[key] || [];
    return topics.map((t, i) => ({
      id: `${key}_${i}`,
      title: t.title,
      area,
      ...t
    }));
  }

  async getLesson(lessonId) {
    return null;
  }

  async createLesson(lessonData) {
    return `lesson_${Date.now()}`;
  }

  async markLessonAsCompleted(userId, lessonId) {
    markLesson(userId, lessonId);
  }

  async getUserLessonsProgress(userId, area) {
    const lessons = await this.getLessonsByArea(area);
    const completed = getCompletedLessons();
    const completedCount = lessons.filter(l => completed.includes(l.id)).length;
    return {
      totalLessons: lessons.length,
      completedLessons: completedCount,
      progress: lessons.length ? (completedCount / lessons.length) * 100 : 0
    };
  }
}

export default new LearningMaterialService();
