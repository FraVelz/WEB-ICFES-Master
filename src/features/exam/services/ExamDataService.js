/**
 * Servicio de datos de exámenes - Versión local (localStorage)
 * Preparado para futura implementación de backend
 */
import { getStoredExams } from '@/shared/utils/progressStorage';

class ExamDataService {
  async createExam(examData) {
    return `exam_${Date.now()}`;
  }

  async getExam(examId) {
    const exams = getStoredExams();
    return exams.find(e => e.id === examId) || null;
  }

  async getAllExams() {
    return getStoredExams();
  }

  async saveExamAnswers(userId, examId, answers) {}
  async getUserExamAnswers(userId, examId) { return null; }
  async getUserExamHistory(userId) { return getStoredExams(); }
  calculateScore(answers) { return 0; }
}

export default new ExamDataService();
