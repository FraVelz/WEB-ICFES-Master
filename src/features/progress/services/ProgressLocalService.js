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
  async updateProgress(userId, data) {
    return getProgress();
  }
  async getProgress(userId) {
    return getProgress();
  }
  async getProgressByArea(userId) {
    return {};
  }
  async getRecommendations(userId) {
    return [];
  }
  async getAttemptHistory(userId, limit) {
    return [...getStoredExams(), ...getStoredPractices()].slice(0, limit || 50);
  }
  async saveAttempt(userId, data) {
    return data;
  }
  async getAreaStatistics(userId) {
    return {};
  }
  async getPerformanceAnalysis(userId, days) {
    return {};
  }
  async resetProgress(userId) {
    clearAllData();
  }
  async getCompletedLessons(userId) {
    return getCompletedLessons();
  }
  async markLessonAsCompleted(userId, lessonId) {
    markLessonAsCompleted(userId, lessonId);
  }
}

export default new ProgressLocalService();
