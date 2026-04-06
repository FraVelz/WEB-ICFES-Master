/**
 * Servicio de datos de exámenes - Versión local (localStorage)
 * Preparado para futura implementación de backend
 */
import { getStoredExams } from '@/shared/utils/progressStorage';

interface StoredExam {
  id?: string;
  [key: string]: unknown;
}

class ExamDataService {
  async createExam(_examData: unknown) {
    return `exam_${Date.now()}`;
  }

  async getExam(examId: string) {
    const exams = getStoredExams();
    return (exams as StoredExam[]).find((e) => e.id === examId) || null;
  }

  async getAllExams() {
    return getStoredExams();
  }

  async saveExamAnswers(_userId: string, _examId: string, _answers: unknown) {}
  async getUserExamAnswers(_userId: string, _examId: string) {
    return null;
  }
  async getUserExamHistory(_userId: string) {
    return getStoredExams();
  }
  calculateScore(_answers: unknown) {
    return 0;
  }
}

export default new ExamDataService();
