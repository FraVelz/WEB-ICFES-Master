/**
 * Servicio de exámenes - Versión local (localStorage)
 */
import { getStoredExams } from '@/shared/utils/progressStorage';

interface StoredExam {
  id?: string;
  [key: string]: unknown;
}

class ExamLocalService {
  async createExam(userId: string, examData: Record<string, unknown>) {
    return {
      id: `exam_${Date.now()}`,
      ...examData,
      userId,
      status: 'in-progress',
    };
  }

  async get(examId: string, _userId: string) {
    const exams = getStoredExams();
    return (exams as StoredExam[]).find((e) => e.id === examId) || null;
  }

  async saveAnswer(
    _examId: string,
    _userId: string,
    answerData: unknown
  ) {
    return answerData;
  }
  async completeExam(_examId: string, _userId: string) {
    return {};
  }
  async abandonExam(_examId: string, _userId: string) {}
  async getExamAnalysis(_examId: string, _userId: string) {
    return null;
  }
  async getWrongAnswers(_examId: string, _userId: string) {
    return [];
  }
  async getExamStats(_userId: string) {
    return {};
  }
  async getUserExams(_userId: string, _filters: Record<string, unknown> = {}) {
    return getStoredExams();
  }
  async compareExams(_id1: string, _id2: string, _userId: string) {
    return null;
  }
  async exportResults(
    _examId: string,
    _userId: string,
    _format?: string
  ) {
    return {};
  }
  async resetUserExams(_userId: string) {
    localStorage.removeItem('icfes_exams');
  }
}

export default new ExamLocalService();
