import { db } from '@/config/firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  writeBatch
} from 'firebase/firestore';

/**
 * Servicio de Firestore para gestionar exámenes
 */
class ExamFirestoreService {
  constructor() {
    this.collectionPath = 'users';
    this.subcollectionName = 'exams';
  }

  /**
   * Crear nuevo examen
   */
  async createExam(userId, examData) {
    try {
      const examId = `exam_${Date.now()}`;
      const examsRef = collection(db, this.collectionPath, userId, this.subcollectionName);
      const examDocRef = doc(examsRef, examId);

      const newExam = {
        id: examId,
        ...examData,
        userId,
        status: 'in-progress',
        startTime: Timestamp.now(),
        endTime: null,
        score: null,
        answers: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      await setDoc(examDocRef, newExam);
      return newExam;
    } catch (error) {
      console.error('Error creando examen:', error);
      throw error;
    }
  }

  /**
   * Guardar respuesta en examen
   */
  async saveAnswer(examId, userId, answerData) {
    try {
      const examRef = doc(db, this.collectionPath, userId, this.subcollectionName, examId);
      const examSnap = await getDoc(examRef);

      if (!examSnap.exists()) {
        throw new Error('Examen no encontrado');
      }

      const exam = examSnap.data();
      const answers = exam.answers || [];

      const newAnswer = {
        questionId: answerData.questionId,
        selectedAnswer: answerData.selectedAnswer,
        correctAnswer: answerData.correctAnswer,
        isCorrect: answerData.selectedAnswer === answerData.correctAnswer,
        area: answerData.area,
        timestamp: Timestamp.now()
      };

      answers.push(newAnswer);

      await updateDoc(examRef, {
        answers,
        updatedAt: Timestamp.now()
      });

      return newAnswer;
    } catch (error) {
      console.error('Error guardando respuesta:', error);
      throw error;
    }
  }

  /**
   * Completar examen
   */
  async completeExam(examId, userId) {
    try {
      const examRef = doc(db, this.collectionPath, userId, this.subcollectionName, examId);
      const examSnap = await getDoc(examRef);

      if (!examSnap.exists()) {
        throw new Error('Examen no encontrado');
      }

      const exam = examSnap.data();
      const answers = exam.answers || [];

      // Calcular puntuación
      const correctAnswers = answers.filter(a => a.isCorrect).length;
      const score = Math.round((correctAnswers / answers.length) * 100);

      await updateDoc(examRef, {
        status: 'completed',
        endTime: Timestamp.now(),
        score,
        updatedAt: Timestamp.now()
      });

      return { score, correctAnswers, totalQuestions: answers.length };
    } catch (error) {
      console.error('Error completando examen:', error);
      throw error;
    }
  }

  /**
   * Abandonar examen
   */
  async abandonExam(examId, userId) {
    try {
      const examRef = doc(db, this.collectionPath, userId, this.subcollectionName, examId);

      await updateDoc(examRef, {
        status: 'abandoned',
        endTime: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      return true;
    } catch (error) {
      console.error('Error abandonando examen:', error);
      throw error;
    }
  }

  /**
   * Obtener examen
   */
  async get(examId, userId) {
    try {
      const examRef = doc(db, this.collectionPath, userId, this.subcollectionName, examId);
      const examSnap = await getDoc(examRef);

      if (!examSnap.exists()) {
        throw new Error('Examen no encontrado');
      }

      return examSnap.data();
    } catch (error) {
      console.error('Error obteniendo examen:', error);
      throw error;
    }
  }

  /**
   * Obtener exámenes del usuario
   */
  async getUserExams(userId, filters = {}) {
    try {
      const examsRef = collection(db, this.collectionPath, userId, this.subcollectionName);
      let q = query(examsRef, orderBy('createdAt', 'desc'));

      // Aplicar filtros si existen
      if (filters.status) {
        q = query(examsRef, where('status', '==', filters.status), orderBy('createdAt', 'desc'));
      }

      if (filters.type) {
        q = query(examsRef, where('type', '==', filters.type), orderBy('createdAt', 'desc'));
      }

      if (filters.area) {
        q = query(examsRef, where('area', '==', filters.area), orderBy('createdAt', 'desc'));
      }

      const querySnapshot = await getDocs(q);
      const exams = [];

      querySnapshot.forEach((doc) => {
        exams.push(doc.data());
      });

      // Aplicar límite
      if (filters.limit) {
        return exams.slice(0, filters.limit);
      }

      return exams;
    } catch (error) {
      console.error('Error obteniendo exámenes del usuario:', error);
      return [];
    }
  }

  /**
   * Obtener estadísticas de exámenes
   */
  async getExamStats(userId) {
    try {
      const exams = await this.getUserExams(userId, { status: 'completed' });

      if (exams.length === 0) {
        return {
          totalExams: 0,
          averageScore: 0,
          bestScore: 0,
          worstScore: 0,
          examsCompleted: 0,
          practiceExams: 0,
          mockExams: 0
        };
      }

      const scores = exams.map(e => e.score).filter(s => s !== null);
      
      return {
        totalExams: exams.length,
        averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
        bestScore: Math.max(...scores),
        worstScore: Math.min(...scores),
        examsCompleted: exams.filter(e => e.status === 'completed').length,
        practiceExams: exams.filter(e => e.type === 'practice').length,
        mockExams: exams.filter(e => e.type === 'mock').length
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas de exámenes:', error);
      throw error;
    }
  }

  /**
   * Obtener análisis de examen
   */
  async getExamAnalysis(examId, userId) {
    try {
      const exam = await this.get(examId, userId);
      const answers = exam.answers || [];

      if (answers.length === 0) {
        return {
          score: 0,
          accuracy: 0,
          byArea: {},
          byDifficulty: {}
        };
      }

      const correctAnswers = answers.filter(a => a.isCorrect).length;
      const accuracy = Math.round((correctAnswers / answers.length) * 100);

      // Análisis por área
      const byArea = {};
      answers.forEach(answer => {
        const area = answer.area || 'General';
        if (!byArea[area]) {
          byArea[area] = { total: 0, correct: 0, percentage: 0 };
        }
        byArea[area].total += 1;
        if (answer.isCorrect) {
          byArea[area].correct += 1;
        }
      });

      // Calcular porcentajes
      Object.keys(byArea).forEach(area => {
        byArea[area].percentage = Math.round(
          (byArea[area].correct / byArea[area].total) * 100
        );
      });

      return {
        score: exam.score || accuracy,
        accuracy,
        totalQuestions: answers.length,
        correctAnswers,
        byArea
      };
    } catch (error) {
      console.error('Error en análisis de examen:', error);
      throw error;
    }
  }

  /**
   * Obtener respuestas incorrectas
   */
  async getWrongAnswers(examId, userId) {
    try {
      const exam = await this.get(examId, userId);
      const answers = exam.answers || [];

      return answers.filter(a => !a.isCorrect);
    } catch (error) {
      console.error('Error obteniendo respuestas incorrectas:', error);
      return [];
    }
  }

  /**
   * Comparar exámenes
   */
  async compareExams(examId1, examId2, userId) {
    try {
      const exam1 = await this.get(examId1, userId);
      const exam2 = await this.get(examId2, userId);

      const score1 = exam1.score || 0;
      const score2 = exam2.score || 0;
      const improvement = score2 - score1;
      const improvementPercent = score1 === 0 ? 100 : Math.round((improvement / score1) * 100);

      return {
        exam1: {
          score: score1,
          date: exam1.createdAt?.toDate?.() || new Date()
        },
        exam2: {
          score: score2,
          date: exam2.createdAt?.toDate?.() || new Date()
        },
        improvement,
        improvementPercent,
        direction: improvement > 0 ? 'improving' : improvement < 0 ? 'declining' : 'same'
      };
    } catch (error) {
      console.error('Error comparando exámenes:', error);
      throw error;
    }
  }

  /**
   * Exportar resultados
   */
  async exportResults(examId, userId, format = 'json') {
    try {
      const exam = await this.get(examId, userId);
      const analysis = await this.getExamAnalysis(examId, userId);

      const exportData = {
        exam,
        analysis,
        exportedAt: new Date().toISOString()
      };

      if (format === 'json') {
        return JSON.stringify(exportData, null, 2);
      }

      if (format === 'csv') {
        return this._convertToCSV(exam, analysis);
      }

      return exportData;
    } catch (error) {
      console.error('Error exportando resultados:', error);
      throw error;
    }
  }

  /**
   * Resetear exámenes del usuario
   */
  async resetUserExams(userId) {
    try {
      const examsRef = collection(db, this.collectionPath, userId, this.subcollectionName);
      const examsSnap = await getDocs(examsRef);

      const batch = writeBatch(db);
      examsSnap.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      return true;
    } catch (error) {
      console.error('Error reseteando exámenes:', error);
      throw error;
    }
  }

  /**
   * Métodos privados
   */

  _convertToCSV(exam, analysis) {
    let csv = 'Análisis de Examen\n\n';
    csv += `Puntuación,${analysis.score}\n`;
    csv += `Precisión,${analysis.accuracy}%\n`;
    csv += `Preguntas Correctas,${analysis.correctAnswers}/${analysis.totalQuestions}\n\n`;

    csv += 'Por Área\n';
    csv += 'Área,Total,Correctas,Porcentaje\n';
    Object.entries(analysis.byArea).forEach(([area, stats]) => {
      csv += `${area},${stats.total},${stats.correct},${stats.percentage}%\n`;
    });

    return csv;
  }
}

export default new ExamFirestoreService();
