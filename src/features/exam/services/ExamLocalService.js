/**
 * Servicio de exámenes - Versión local (localStorage)
 */
import { getStoredExams } from '@/shared/utils/progressStorage';

class ExamLocalService {
  async createExam(userId, examData) {
    const exam = { id: `exam_${Date.now()}`, ...examData, userId, status: 'in-progress' };
    return exam;
  }

  async get(examId, userId) {
    const exams = getStoredExams();
    return exams.find(e => e.id === examId) || null;
  }

  async saveAnswer(examId, userId, answerData) { return answerData; }
  async completeExam(examId, userId) { return {}; }
  async abandonExam(examId, userId) {}
  async getExamAnalysis(examId, userId) { return null; }
  async getWrongAnswers(examId, userId) { return []; }
  async getExamStats(userId) { return {}; }
  async getUserExams(userId, filters = {}) { return getStoredExams(); }
  async compareExams(id1, id2, userId) { return null; }
  async exportResults(examId, userId, format) { return {}; }
  async resetUserExams(userId) {
    localStorage.removeItem('icfes_exams');
  }
}

export default new ExamLocalService();
