/**
 * Servicio de progreso - Versión local (localStorage)
 */
import {
  getProgress,
  getStoredExams,
  getStoredPractices,
  clearAllData,
  getCompletedLessons,
  markLessonAsCompleted,
} from '@/shared/utils/progressStorage';

class ProgressLocalService {
  async updateProgress(_userId: string, _data: unknown) {
    return getProgress();
  }
  async getProgress(_userId: string) {
    return getProgress();
  }
  async getProgressByArea(_userId: string) {
    return {};
  }
  async getRecommendations(_userId: string) {
    return [];
  }
  async getAttemptHistory(_userId: string, limit?: number) {
    return [...getStoredExams(), ...getStoredPractices()].slice(0, limit || 50);
  }
  async saveAttempt(_userId: string, data: unknown) {
    return data;
  }
  async getAreaStatistics(_userId: string) {
    return {};
  }
  async getPerformanceAnalysis(_userId: string, _days?: number) {
    return {};
  }
  async resetProgress(_userId: string) {
    clearAllData();
  }
  async getCompletedLessons(_userId: string) {
    return getCompletedLessons();
  }
  async markLessonAsCompleted(userId: string, lessonId: string) {
    markLessonAsCompleted(userId, lessonId);
  }
}

export default new ProgressLocalService();
