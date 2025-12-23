import { doc, collection, setDoc, getDoc, updateDoc, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';

/**
 * Servicio para manejar resultados de pruebas/simulacros en Firestore
 * Maneja: Guardar, obtener, analizar resultados
 */
class TestResultService {
  /**
   * Guarda el resultado de una prueba
   * @param {string} userId - ID del usuario
   * @param {Object} resultData - Datos del resultado
   * @returns {Promise<string>} - ID del resultado guardado
   */
  async saveTestResult(userId, resultData) {
    try {
      const resultsRef = collection(db, 'testResults');
      const docRef = await addDoc(resultsRef, {
        userId,
        ...resultData,
        completedAt: Timestamp.now(),
        score: this.calculateScore(resultData),
        totalQuestions: resultData.questions?.length || 0,
        correctAnswers: this.countCorrectAnswers(resultData)
      });
      
      // Actualizar estadísticas del usuario
      await this.updateUserTestStats(userId);
      
      return docRef.id;
    } catch (error) {
      console.error('Error al guardar resultado de prueba:', error);
      throw error;
    }
  }

  /**
   * Obtiene un resultado específico
   * @param {string} resultId - ID del resultado
   * @returns {Promise<Object|null>}
   */
  async getTestResult(resultId) {
    try {
      const resultRef = doc(db, 'testResults', resultId);
      const resultDoc = await getDoc(resultRef);
      
      if (resultDoc.exists()) {
        return { id: resultDoc.id, ...resultDoc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error al obtener resultado:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los resultados de un usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<Array>}
   */
  async getUserTestResults(userId) {
    try {
      const q = query(collection(db, 'testResults'), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error al obtener resultados del usuario:', error);
      throw error;
    }
  }

  /**
   * Obtiene resultados de un usuario filtrados por tipo de prueba
   * @param {string} userId - ID del usuario
   * @param {string} testType - Tipo de prueba (simulacro, repaso, etc)
   * @returns {Promise<Array>}
   */
  async getUserTestResultsByType(userId, testType) {
    try {
      const allResults = await this.getUserTestResults(userId);
      return allResults.filter(result => result.testType === testType);
    } catch (error) {
      console.error('Error al obtener resultados por tipo:', error);
      throw error;
    }
  }

  /**
   * Obtiene el análisis de desempeño del usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>}
   */
  async getPerformanceAnalysis(userId) {
    try {
      const results = await this.getUserTestResults(userId);
      
      if (results.length === 0) {
        return {
          totalTests: 0,
          averageScore: 0,
          bestScore: 0,
          worstScore: 0,
          scoreHistory: []
        };
      }

      const scores = results.map(r => r.score);
      const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;

      return {
        totalTests: results.length,
        averageScore: parseFloat(averageScore.toFixed(2)),
        bestScore: Math.max(...scores),
        worstScore: Math.min(...scores),
        lastTestDate: results[results.length - 1]?.completedAt,
        scoreHistory: scores,
        improvement: this.calculateImprovement(scores)
      };
    } catch (error) {
      console.error('Error al analizar desempeño:', error);
      throw error;
    }
  }

  /**
   * Obtiene el análisis por tema/asignatura
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>}
   */
  async getPerformanceBySubject(userId) {
    try {
      const results = await this.getUserTestResults(userId);
      const subjectStats = {};

      results.forEach(result => {
        const subject = result.subject || 'General';
        if (!subjectStats[subject]) {
          subjectStats[subject] = {
            totalTests: 0,
            scores: [],
            averageScore: 0
          };
        }
        subjectStats[subject].totalTests++;
        subjectStats[subject].scores.push(result.score);
      });

      // Calcular promedios
      Object.keys(subjectStats).forEach(subject => {
        const scores = subjectStats[subject].scores;
        subjectStats[subject].averageScore = 
          parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2));
      });

      return subjectStats;
    } catch (error) {
      console.error('Error al analizar desempeño por asignatura:', error);
      throw error;
    }
  }

  /**
   * Calcula el puntaje de una prueba
   * @param {Object} resultData - Datos de la prueba
   * @returns {number}
   */
  calculateScore(resultData) {
    if (!resultData.questions) return 0;
    
    const totalPoints = resultData.questions.reduce((sum, q) => {
      return sum + (q.points || 1);
    }, 0);

    const correctPoints = resultData.questions
      .filter(q => q.isCorrect)
      .reduce((sum, q) => sum + (q.points || 1), 0);

    return totalPoints > 0 ? (correctPoints / totalPoints) * 100 : 0;
  }

  /**
   * Cuenta respuestas correctas
   * @param {Object} resultData - Datos de la prueba
   * @returns {number}
   */
  countCorrectAnswers(resultData) {
    if (!resultData.questions) return 0;
    return resultData.questions.filter(q => q.isCorrect).length;
  }

  /**
   * Calcula la mejora en el desempeño
   * @param {Array} scores - Array de puntajes
   * @returns {number}
   */
  calculateImprovement(scores) {
    if (scores.length < 2) return 0;
    const firstScore = scores[0];
    const lastScore = scores[scores.length - 1];
    return parseFloat(((lastScore - firstScore) / firstScore * 100).toFixed(2));
  }

  /**
   * Actualiza estadísticas del usuario después de una prueba
   * @param {string} userId - ID del usuario
   * @returns {Promise<void>}
   */
  async updateUserTestStats(userId) {
    try {
      const results = await this.getUserTestResults(userId);
      const userStatsRef = doc(db, 'userStats', userId);
      
      const scores = results.map(r => r.score);
      
      await updateDoc(userStatsRef, {
        totalTestsTaken: results.length,
        averageTestScore: scores.reduce((a, b) => a + b, 0) / scores.length,
        bestTestScore: Math.max(...scores),
        lastTestDate: Timestamp.now()
      }).catch(async () => {
        // Si el documento no existe, lo creamos
        await setDoc(userStatsRef, {
          userId,
          totalTestsTaken: results.length,
          averageTestScore: scores.reduce((a, b) => a + b, 0) / scores.length,
          bestTestScore: Math.max(...scores),
          lastTestDate: Timestamp.now()
        });
      });
    } catch (error) {
      console.error('Error al actualizar estadísticas:', error);
    }
  }
}

export default new TestResultService();
