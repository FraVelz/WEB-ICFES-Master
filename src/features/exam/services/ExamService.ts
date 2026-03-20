/**
 * EXAM SERVICE - Gestión de exámenes, cuestionarios y respuestas
 * Maneja: exámenes completados, respuestas guardadas, análisis de respuestas
 */

import BaseService from '@/services/BaseService';

class ExamService extends BaseService {
  constructor() {
    super('exam');
  }

  /**
   * Crear un nuevo examen/cuestionario
   * @param {string} userId
   * @param {Object} examData - {type, area, difficulty, questions, timeLimit}
   * @returns {Promise<Object>}
   */
  async createExam(userId, examData) {
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
   * @param {string} examId
   * @param {Object} answerData - {questionId, selectedAnswer, isCorrect, timeSpent}
   * @returns {Promise<Object>}
   */
  async saveAnswer(examId, answerData) {
    const exam = await this.get(examId);

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
   * @param {string} examId
   * @returns {Promise<Object>}
   */
  async completeExam(examId) {
    const exam = await this.get(examId);

    // Calcular puntuación
    const correctAnswers = exam.answers.filter((a) => a.isCorrect).length;
    const score = Math.round((correctAnswers / exam.totalQuestions) * 100);

    // Calcular tiempo total
    const totalTime = exam.answers.reduce(
      (sum, a) => sum + (a.timeSpent || 0),
      0
    );

    return this.update(examId, {
      ...exam,
      completedAt: new Date().toISOString(),
      score,
      status: 'completed',
      totalTime,
      correctAnswers,
      wrongAnswers: exam.totalQuestions - correctAnswers,
      grade: this._calculateGrade(score),
    });
  }

  /**
   * Abandonar un examen
   * @param {string} examId
   * @returns {Promise<Object>}
   */
  async abandonExam(examId) {
    const exam = await this.get(examId);
    return this.update(examId, {
      ...exam,
      status: 'abandoned',
      abandonedAt: new Date().toISOString(),
    });
  }

  /**
   * Obtener historial de exámenes del usuario
   * @param {string} userId
   * @param {Object} filters - {type, area, status, limit}
   * @returns {Promise<Array>}
   */
  async getUserExams(userId, filters = {}) {
    try {
      const exams = await this.get();

      let result = Array.isArray(exams)
        ? exams.filter((e) => e.userId === userId)
        : [];

      // Aplicar filtros
      if (filters.type) {
        result = result.filter((e) => e.type === filters.type);
      }
      if (filters.area) {
        result = result.filter((e) => e.area === filters.area);
      }
      if (filters.status) {
        result = result.filter((e) => e.status === filters.status);
      }

      // Ordenar por fecha descendente
      result.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));

      // Aplicar límite
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
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getExamStats(userId) {
    const exams = await this.getUserExams(userId, { status: 'completed' });

    if (exams.length === 0) {
      return {
        totalExams: 0,
        averageScore: 0,
        bestScore: 0,
        worstScore: 0,
        examsCompleted: 0,
      };
    }

    const scores = exams.map((e) => e.score);

    return {
      totalExams: exams.length,
      averageScore: Math.round(
        scores.reduce((a, b) => a + b, 0) / scores.length
      ),
      bestScore: Math.max(...scores),
      worstScore: Math.min(...scores),
      examsCompleted: exams.filter((e) => e.status === 'completed').length,
      practiceExams: exams.filter((e) => e.type === 'practice').length,
      mockExams: exams.filter((e) => e.type === 'mock').length,
    };
  }

  /**
   * Obtener análisis detallado de un examen
   * @param {string} examId
   * @returns {Promise<Object>}
   */
  async getExamAnalysis(examId) {
    const exam = await this.get(examId);

    // Agrupar respuestas por área
    const byArea = {};
    exam.answers.forEach((answer) => {
      const question = exam.questions.find((q) => q.id === answer.questionId);
      if (question) {
        if (!byArea[question.area]) {
          byArea[question.area] = { correct: 0, total: 0 };
        }
        byArea[question.area].total++;
        if (answer.isCorrect) {
          byArea[question.area].correct++;
        }
      }
    });

    // Agrupar respuestas por dificultad
    const byDifficulty = {};
    exam.answers.forEach((answer) => {
      const question = exam.questions.find((q) => q.id === answer.questionId);
      if (question) {
        const diff = question.difficulty || 'media';
        if (!byDifficulty[diff]) {
          byDifficulty[diff] = { correct: 0, total: 0 };
        }
        byDifficulty[diff].total++;
        if (answer.isCorrect) {
          byDifficulty[diff].correct++;
        }
      }
    });

    // Calcular tiempos
    const avgTimePerQuestion =
      exam.answers.length > 0
        ? Math.round(
            exam.answers.reduce((sum, a) => sum + (a.timeSpent || 0), 0) /
              exam.answers.length
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
   * @param {string} examId
   * @returns {Promise<Array>}
   */
  async getWrongAnswers(examId) {
    const exam = await this.get(examId);

    return exam.answers
      .filter((answer) => !answer.isCorrect)
      .map((answer) => {
        const question = exam.questions.find((q) => q.id === answer.questionId);
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
   * @param {string} examId1
   * @param {string} examId2
   * @returns {Promise<Object>}
   */
  async compareExams(examId1, examId2) {
    const exam1 = await this.get(examId1);
    const exam2 = await this.get(examId2);

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
      improvement: exam2.score - exam1.score,
      improvementPercent:
        exam1.score > 0
          ? Math.round(((exam2.score - exam1.score) / exam1.score) * 100)
          : 0,
    };
  }

  /**
   * Exportar resultados de un examen (PDF, JSON, etc)
   * @param {string} examId
   * @param {string} format - 'json', 'csv'
   * @returns {Promise<string>}
   */
  async exportResults(examId, format = 'json') {
    const exam = await this.get(examId);
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
      // Convertir a CSV
      let csv =
        'Pregunta,Respuesta Seleccionada,Respuesta Correcta,Correcta,Tiempo (s)\n';
      exam.answers.forEach((answer) => {
        csv += `"${answer.questionId}","${answer.selectedAnswer}","${answer.correctAnswer}",${answer.isCorrect},${answer.timeSpent}\n`;
      });
      return csv;
    }

    return null;
  }

  /**
   * Resetear historial de exámenes del usuario
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async resetUserExams(userId) {
    const exams = await this.getUserExams(userId);
    for (const exam of exams) {
      await this.delete(exam.id);
    }
    return { success: true, deletedCount: exams.length };
  }

  // ============ MÉTODOS PRIVADOS ============

  _calculateGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }
}

export default new ExamService();
