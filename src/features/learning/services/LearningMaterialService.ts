/**
 * Servicio de materiales de aprendizaje - Supabase o local
 */
import { BASICO_TOPICS } from '../data/roadmapData';
import { getCompletedLessons, markLessonAsCompleted as markLesson } from '@/shared/utils/progressStorage';
import API_CONFIG from '@/services/api.config';
import LearningSupabaseService from '@/services/supabase/LearningSupabaseService';

const AREA_MAP: Record<string, string> = { 'sociales-ciudadanas': 'sociales' };

interface TopicItem {
  title?: string;
  [key: string]: unknown;
}

class LearningMaterialService {
  async getLessonsByArea(area: string) {
    if (API_CONFIG.MODE === 'supabase') {
      const lessons = await LearningSupabaseService.getLessonsByArea(area);
      if (lessons?.length > 0) return lessons;
    }

    const key = AREA_MAP[area] ?? area;
    const topics = (BASICO_TOPICS as Record<string, TopicItem[]>)[key] ?? [];
    return topics.map((t: TopicItem, i: number) => ({
      id: `${key}_${i}`,
      title: t.title,
      area,
      ...t,
    }));
  }

  async getLesson(lessonId: string) {
    if (API_CONFIG.MODE === 'supabase') {
      return LearningSupabaseService.getLesson(lessonId);
    }
    return null;
  }

  async createLesson(_lessonData: unknown) {
    return `lesson_${Date.now()}`;
  }

  async markLessonAsCompleted(userId: string, lessonId: string) {
    markLesson(userId, lessonId);
  }

  async getUserLessonsProgress(userId: string, area: string) {
    const lessons = await this.getLessonsByArea(area);
    const completed = getCompletedLessons();
    const completedCount = lessons.filter((l: { id: string }) => completed.includes(l.id)).length;
    return {
      totalLessons: lessons.length,
      completedLessons: completedCount,
      progress: lessons.length ? (completedCount / lessons.length) * 100 : 0,
    };
  }
}

export default new LearningMaterialService();
