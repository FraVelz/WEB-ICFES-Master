/**
 * EXAM SERVICE - Gestión de exámenes, cuestionarios y respuestas
 * Maneja: exámenes completados, respuestas guardadas, análisis de respuestas
 */

import BaseService from '@/services/BaseService';
import type { ExamData, ExamRecord, AnswerRecord } from '../types/exam';

class ExamService extends BaseService {
  constructor() {
    super('exam');
  }

  /**
   * Crear un nuevo examen/cuestionario
   */
  async createExam(userId: string, examData: ExamData) {
    return this.create({
      userId,
      type: examData.type || 'practice', // 'practice', 'mock', 'diagnostic'
      area: examData.area || null,
      difficulty: examData.difficulty || 'mixto',
      totalQuestions: examData.questions?.length || 0,
      questions: examData.questions || [],
      timeLimit: examData.timeLimit || null, // en minutos
      startedAt: new Date().toISOString(),
      completedAt: null,
      answers: [],
      score: null,
      status: 'in_progress', // 'in_progress', 'completed', 'abandoned'
    });
  }

  /**
   * Guardar respuesta en un examen
   */
  async saveAnswer(
    examId: string,
    answerData: {
      questionId: string;
      selectedAnswer: string;
      correctAnswer: string;
      isCorrect: boolean;
      timeSpent?: number;
    }
  ) {
    const exam = (await this.get(examId)) as ExamRecord;
    if (!exam || !exam.answers) throw new Error('Examen no encontrado');

    // Evitar duplicados
    const existingIndex = exam.answers.findIndex(
      (a) => a.questionId === answerData.questionId
    );

    const answerRecord = {
      questionId: answerData.questionId,
      selectedAnswer: answerData.selectedAnswer,
      correctAnswer: answerData.correctAnswer,
      isCorrect: answerData.isCorrect,
      timeSpent: answerData.timeSpent || 0,
      savedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      exam.answers[existingIndex] = answerRecord;
    } else {
      exam.answers.push(answerRecord);
    }

    return this.update(examId, exam);
  }

  /**
   * Completar examen y calcular puntuación
   */
  async completeExam(examId: string) {
    const exam = (await this.get(examId)) as ExamRecord;
    if (!exam) throw new Error('Examen no encontrado');

    const totalQuestions = exam.totalQuestions ?? exam.answers?.length ?? 1;
    const correctAnswers = (exam.answers ?? []).filter((a: AnswerRecord) => a.isCorrect).length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    // Calcular tiempo total
    const totalTime = (exam.answers ?? []).reduce(
      (sum: number, a: AnswerRecord) => sum + (a.timeSpent || 0),
      0
    );

    return this.update(examId, {
      ...exam,
      completedAt: new Date().toISOString(),
      score,
      status: 'completed',
      totalTime,
      correctAnswers,
      wrongAnswers: totalQuestions - correctAnswers,
      grade: this._calculateGrade(score),
    });
  }

  /**
   * Abandonar un examen
   */
  async abandonExam(examId: string) {
    const exam = (await this.get(examId)) as ExamRecord;
    return this.update(examId, {
      ...exam,
      status: 'abandoned',
      abandonedAt: new Date().toISOString(),
    });
  }

  /**
   * Obtener historial de exámenes del usuario
   */
  async getUserExams(
    userId: string,
    filters: { type?: string; area?: string; status?: string; limit?: number } = {}
  ) {
    try {
      const exams = (await this.get()) as ExamRecord[];

      let result = Array.isArray(exams)
        ? exams.filter((e) => e.userId === userId)
        : [];

      if (filters.type) {
        result = result.filter((e) => e.type === filters.type);
      }
      if (filters.area) {
        result = result.filter((e) => e.area === filters.area);
      }
      if (filters.status) {
        result = result.filter((e) => e.status === filters.status);
      }

      result.sort(
        (a, b) =>
          new Date(b.startedAt ?? 0).getTime() -
          new Date(a.startedAt ?? 0).getTime()
      );

      if (filters.limit) {
        result = result.slice(0, filters.limit);
      }

      return result;
    } catch (error) {
      console.error('Error obteniendo exámenes del usuario:', error);
      return [];
    }
  }

  /**
   * Obtener estadísticas de exámenes
   */
  async getExamStats(userId: string) {
    const exams = (await this.getUserExams(userId, {
      status: 'completed',
    })) as ExamRecord[];

    if (exams.length === 0) {
      return {
        totalExams: 0,
        averageScore: 0,
        bestScore: 0,
        worstScore: 0,
        examsCompleted: 0,
      };
    }

    const scores = exams.map((e) => e.score ?? 0).filter((s) => typeof s === 'number');

    return {
      totalExams: exams.length,
      averageScore:
        scores.length > 0
          ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
          : 0,
      bestScore: scores.length > 0 ? Math.max(...scores) : 0,
      worstScore: scores.length > 0 ? Math.min(...scores) : 0,
      examsCompleted: exams.filter((e) => e.status === 'completed').length,
      practiceExams: exams.filter((e) => e.type === 'practice').length,
      mockExams: exams.filter((e) => e.type === 'mock').length,
    };
  }

  /**
   * Obtener análisis detallado de un examen
   */
  async getExamAnalysis(examId: string) {
    const exam = (await this.get(examId)) as ExamRecord;
    if (!exam) throw new Error('Examen no encontrado');

    const byArea: Record<string, { correct: number; total: number }> = {};
    (exam.answers ?? []).forEach((answer: AnswerRecord) => {
      const question = (exam.questions ?? []).find(
        (q: { id?: string; area?: string }) => q.id === answer.questionId
      );
      if (question?.area) {
        if (!byArea[question.area]) {
          byArea[question.area] = { correct: 0, total: 0 };
        }
        byArea[question.area].total++;
        if (answer.isCorrect) {
          byArea[question.area].correct++;
        }
      }
    });

    const byDifficulty: Record<string, { correct: number; total: number }> = {};
    (exam.answers ?? []).forEach((answer: AnswerRecord) => {
      const question = (exam.questions ?? []).find(
        (q: { id?: string; difficulty?: string }) => q.id === answer.questionId
      );
      if (question) {
        const diff = question.difficulty ?? 'media';
        if (!byDifficulty[diff]) {
          byDifficulty[diff] = { correct: 0, total: 0 };
        }
        byDifficulty[diff].total++;
        if (answer.isCorrect) {
          byDifficulty[diff].correct++;
        }
      }
    });

    const avgTimePerQuestion =
      (exam.answers ?? []).length > 0
        ? Math.round(
            (exam.answers ?? []).reduce(
              (sum: number, a: AnswerRecord) => sum + (a.timeSpent || 0),
              0
            ) / (exam.answers ?? []).length
          )
        : 0;

    return {
      examId: exam.id,
      type: exam.type,
      score: exam.score,
      grade: exam.grade,
      totalQuestions: exam.totalQuestions,
      correctAnswers: exam.correctAnswers,
      accuracy: exam.score,
      completedAt: exam.completedAt,
      totalTime: exam.totalTime,
      avgTimePerQuestion,
      byArea: Object.entries(byArea).map(([area, stats]) => ({
        area,
        ...stats,
        percentage: Math.round((stats.correct / stats.total) * 100),
      })),
      byDifficulty: Object.entries(byDifficulty).map(([difficulty, stats]) => ({
        difficulty,
        ...stats,
        percentage: Math.round((stats.correct / stats.total) * 100),
      })),
    };
  }

  /**
   * Obtener preguntas incorrectas para revisión
   */
  async getWrongAnswers(examId: string) {
    const exam = (await this.get(examId)) as ExamRecord;
    if (!exam?.answers) return [];

    return (exam.answers ?? [])
      .filter((answer: AnswerRecord) => !answer.isCorrect)
      .map((answer: AnswerRecord) => {
        const question = (exam.questions ?? []).find(
          (q: { id?: string }) => q.id === answer.questionId
        );
        return {
          questionId: answer.questionId,
          question: question?.text,
          area: question?.area,
          difficulty: question?.difficulty,
          selectedAnswer: answer.selectedAnswer,
          correctAnswer: answer.correctAnswer,
          explanation: question?.explanation,
        };
      });
  }

  /**
   * Comparar dos exámenes
   */
  async compareExams(examId1: string, examId2: string) {
    const exam1 = (await this.get(examId1)) as ExamRecord;
    const exam2 = (await this.get(examId2)) as ExamRecord;

    return {
      exam1: {
        id: exam1.id,
        score: exam1.score,
        completedAt: exam1.completedAt,
      },
      exam2: {
        id: exam2.id,
        score: exam2.score,
        completedAt: exam2.completedAt,
      },
      improvement: (exam2?.score ?? 0) - (exam1?.score ?? 0),
      improvementPercent:
        (exam1?.score ?? 0) > 0
          ? Math.round(
              (((exam2?.score ?? 0) - (exam1?.score ?? 0)) /
                (exam1?.score ?? 1)) *
                100
            )
          : 0,
    };
  }

  /**
   * Exportar resultados de un examen
   */
  async exportResults(examId: string, format = 'json') {
    const exam = (await this.get(examId)) as ExamRecord;
    const analysis = await this.getExamAnalysis(examId);

    if (format === 'json') {
      return JSON.stringify(
        {
          exam,
          analysis,
        },
        null,
        2
      );
    } else if (format === 'csv') {
      let csv =
        'Pregunta,Respuesta Seleccionada,Respuesta Correcta,Correcta,Tiempo (s)\n';
      (exam.answers ?? []).forEach((answer: AnswerRecord) => {
        csv += `"${answer.questionId}","${answer.selectedAnswer}","${answer.correctAnswer}",${answer.isCorrect},${answer.timeSpent}\n`;
      });
      return csv;
    }

    return null;
  }

  /**
   * Resetear historial de exámenes del usuario
   */
  async resetUserExams(userId: string) {
    const exams = (await this.getUserExams(userId)) as ExamRecord[];
    for (const exam of exams) {
      await this.delete(exam.id);
    }
    return { success: true, deletedCount: exams.length };
  }

  // ============ MÉTODOS PRIVADOS ============

  _calculateGrade(score: number) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }
}

export default new ExamService();
