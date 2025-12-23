import { db } from '@/config/firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  getDocs,
  writeBatch,
  Timestamp,
  query,
  orderBy,
  limit,
  arrayUnion
} from 'firebase/firestore';

/**
 * Servicio de Firestore para gestionar progreso de usuarios
 */
class ProgressFirestoreService {
  constructor() {
    this.collectionPath = 'users';
    this.subcollectionName = 'progress';
  }

  /**
   * Crear o actualizar registro de progreso
   */
  async updateProgress(userId, progressData) {
    try {
      const progressRef = doc(db, this.collectionPath, userId, this.subcollectionName, 'current');
      
      const data = {
        ...progressData,
        userId,
        updatedAt: Timestamp.now(),
        // Asegurar campos existentes
        ...(!(await this._progressExists(userId)) && {
          createdAt: Timestamp.now()
        })
      };

      await setDoc(progressRef, data, { merge: true });
      return data;
    } catch (error) {
      console.error('Error actualizando progreso:', error);
      throw error;
    }
  }

  /**
   * Obtener progreso del usuario
   */
  async getProgress(userId) {
    try {
      const progressRef = doc(db, this.collectionPath, userId, this.subcollectionName, 'current');
      const progressSnap = await getDoc(progressRef);

      if (!progressSnap.exists()) {
        return this._getDefaultProgress(userId);
      }

      return progressSnap.data();
    } catch (error) {
      console.error('Error obteniendo progreso:', error);
      return this._getDefaultProgress(userId);
    }
  }

  /**
   * Marcar lección como completada
   */
  async markLessonAsCompleted(userId, lessonId) {
    try {
      const progressRef = doc(db, this.collectionPath, userId, this.subcollectionName, 'current');
      
      // Verificar si el documento existe, si no, crearlo
      if (!(await this._progressExists(userId))) {
        await this.updateProgress(userId, {});
      }

      await updateDoc(progressRef, {
        completedLessons: arrayUnion(lessonId),
        updatedAt: Timestamp.now()
      });
      
      return true;
    } catch (error) {
      console.error('Error marcando lección como completada:', error);
      throw error;
    }
  }

  /**
   * Obtener lecciones completadas
   */
  async getCompletedLessons(userId) {
    try {
      const progress = await this.getProgress(userId);
      return progress.completedLessons || [];
    } catch (error) {
      console.error('Error obteniendo lecciones completadas:', error);
      return [];
    }
  }

  /**
   * Obtener progreso por área
   */
  async getProgressByArea(userId) {
    try {
      const progress = await this.getProgress(userId);
      
      return {
        'Matemáticas': progress.areas?.matematicas || { 
          total: 0, 
          correct: 0, 
          percentage: 0,
          lastAttempt: null 
        },
        'Lectura Crítica': progress.areas?.lecturaCritica || { 
          total: 0, 
          correct: 0, 
          percentage: 0,
          lastAttempt: null 
        },
        'Ciencias Naturales': progress.areas?.cienciasNaturales || { 
          total: 0, 
          correct: 0, 
          percentage: 0,
          lastAttempt: null 
        }
      };
    } catch (error) {
      console.error('Error obteniendo progreso por área:', error);
      throw error;
    }
  }

  /**
   * Guardar intento/respuesta
   */
  async saveAttempt(userId, attemptData) {
    try {
      const attemptsRef = collection(db, this.collectionPath, userId, 'attempts');
      
      const newAttempt = {
        ...attemptData,
        userId,
        timestamp: Timestamp.now(),
        id: `attempt_${Date.now()}`
      };

      const attemptDocRef = doc(attemptsRef, newAttempt.id);
      await setDoc(attemptDocRef, newAttempt);

      // Actualizar progreso general después de guardar intento
      await this._updateProgressFromAttempt(userId, attemptData);

      return newAttempt;
    } catch (error) {
      console.error('Error guardando intento:', error);
      throw error;
    }
  }

  /**
   * Obtener historial de intentos
   */
  async getAttemptHistory(userId, limit_num = 50) {
    try {
      const attemptsRef = collection(db, this.collectionPath, userId, 'attempts');
      const q = query(
        attemptsRef,
        orderBy('timestamp', 'desc'),
        limit(limit_num)
      );

      const querySnapshot = await getDocs(q);
      const attempts = [];

      querySnapshot.forEach((doc) => {
        attempts.push(doc.data());
      });

      return attempts;
    } catch (error) {
      console.error('Error obteniendo historial de intentos:', error);
      return [];
    }
  }

  /**
   * Calcular estadísticas por área
   */
  async getAreaStatistics(userId) {
    try {
      const attempts = await this.getAttemptHistory(userId, 100);
      
      const stats = {
        'Matemáticas': { total: 0, correct: 0, percentage: 0 },
        'Lectura Crítica': { total: 0, correct: 0, percentage: 0 },
        'Ciencias Naturales': { total: 0, correct: 0, percentage: 0 }
      };

      attempts.forEach(attempt => {
        const area = attempt.area || 'Matemáticas';
        if (stats[area]) {
          stats[area].total += 1;
          if (attempt.isCorrect) {
            stats[area].correct += 1;
          }
        }
      });

      // Calcular porcentajes
      Object.keys(stats).forEach(area => {
        if (stats[area].total > 0) {
          stats[area].percentage = Math.round(
            (stats[area].correct / stats[area].total) * 100
          );
        }
      });

      return stats;
    } catch (error) {
      console.error('Error calculando estadísticas por área:', error);
      throw error;
    }
  }

  /**
   * Obtener recomendaciones basadas en progreso
   */
  async getRecommendations(userId) {
    try {
      await this.getProgress(userId);
      const areaStats = await this.getAreaStatistics(userId);
      
      const recommendations = [];

      Object.entries(areaStats).forEach(([area, stats]) => {
        if (stats.total === 0) {
          recommendations.push({
            priority: 'high',
            area,
            message: `¡Comienza a practicar ${area}!`,
            type: 'start'
          });
        } else if (stats.percentage < 60) {
          recommendations.push({
            priority: 'high',
            area,
            message: `Necesitas mejorar en ${area} (${stats.percentage}%)`,
            type: 'improve'
          });
        } else if (stats.percentage >= 90) {
          recommendations.push({
            priority: 'low',
            area,
            message: `¡Excelente desempeño en ${area}!`,
            type: 'maintain'
          });
        }
      });

      return recommendations.sort((a, b) => {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    } catch (error) {
      console.error('Error obteniendo recomendaciones:', error);
      throw error;
    }
  }

  /**
   * Obtener análisis de rendimiento temporal
   */
  async getPerformanceAnalysis(userId, days = 30) {
    try {
      const attempts = await this.getAttemptHistory(userId, 300);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const recentAttempts = attempts.filter(attempt => {
        const attemptDate = attempt.timestamp?.toDate?.() || new Date(attempt.timestamp);
        return attemptDate >= cutoffDate;
      });

      if (recentAttempts.length === 0) {
        return {
          totalAttempts: 0,
          correctAttempts: 0,
          accuracy: 0,
          trend: 'no data'
        };
      }

      const correct = recentAttempts.filter(a => a.isCorrect).length;
      const accuracy = Math.round((correct / recentAttempts.length) * 100);

      // Calcular tendencia (primeros 50% vs últimos 50%)
      const mid = Math.floor(recentAttempts.length / 2);
      const firstHalf = recentAttempts.slice(0, mid);
      const secondHalf = recentAttempts.slice(mid);

      const accuracyFirstHalf = Math.round(
        (firstHalf.filter(a => a.isCorrect).length / firstHalf.length) * 100
      );
      const accuracySecondHalf = Math.round(
        (secondHalf.filter(a => a.isCorrect).length / secondHalf.length) * 100
      );

      let trend = 'stable';
      if (accuracySecondHalf > accuracyFirstHalf + 5) {
        trend = 'improving';
      } else if (accuracySecondHalf < accuracyFirstHalf - 5) {
        trend = 'declining';
      }

      return {
        totalAttempts: recentAttempts.length,
        correctAttempts: correct,
        accuracy,
        trend,
        period: `Últimos ${days} días`
      };
    } catch (error) {
      console.error('Error en análisis de rendimiento:', error);
      throw error;
    }
  }

  /**
   * Resetear progreso del usuario
   */
  async resetProgress(userId) {
    try {
      const batch = writeBatch(db);

      // Eliminar documentos de intentos
      const attemptsRef = collection(db, this.collectionPath, userId, 'attempts');
      const attemptsSnap = await getDocs(attemptsRef);
      attemptsSnap.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Restablecer progreso actual
      const progressRef = doc(db, this.collectionPath, userId, this.subcollectionName, 'current');
      batch.set(progressRef, this._getDefaultProgress(userId));

      await batch.commit();
      return true;
    } catch (error) {
      console.error('Error reseteando progreso:', error);
      throw error;
    }
  }

  /**
   * Métodos privados
   */

  async _progressExists(userId) {
    try {
      const progressRef = doc(db, this.collectionPath, userId, this.subcollectionName, 'current');
      const progressSnap = await getDoc(progressRef);
      return progressSnap.exists();
    } catch {
      return false;
    }
  }

  _getDefaultProgress(userId) {
    return {
      userId,
      totalAttempts: 0,
      totalCorrect: 0,
      percentage: 0,
      streakDays: 0,
      lastAttemptDate: null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      areas: {
        matematicas: {
          total: 0,
          correct: 0,
          percentage: 0
        },
        lecturaCritica: {
          total: 0,
          correct: 0,
          percentage: 0
        },
        cienciasNaturales: {
          total: 0,
          correct: 0,
          percentage: 0
        }
      }
    };
  }

  async _updateProgressFromAttempt(userId, attemptData) {
    try {
      const progress = await this.getProgress(userId);
      const { isCorrect, area } = attemptData;

      // Actualizar totales
      const newTotalAttempts = (progress.totalAttempts || 0) + 1;
      const newTotalCorrect = (progress.totalCorrect || 0) + (isCorrect ? 1 : 0);
      const newPercentage = Math.round((newTotalCorrect / newTotalAttempts) * 100);

      // Actualizar área específica
      const areaKey = this._getAreaKey(area);
      const currentAreaStats = progress.areas?.[areaKey] || { total: 0, correct: 0, percentage: 0 };
      
      currentAreaStats.total += 1;
      if (isCorrect) {
        currentAreaStats.correct += 1;
      }
      currentAreaStats.percentage = Math.round(
        (currentAreaStats.correct / currentAreaStats.total) * 100
      );

      // Actualizar en Firestore
      const progressRef = doc(db, this.collectionPath, userId, this.subcollectionName, 'current');
      await updateDoc(progressRef, {
        totalAttempts: newTotalAttempts,
        totalCorrect: newTotalCorrect,
        percentage: newPercentage,
        lastAttemptDate: Timestamp.now(),
        [`areas.${areaKey}`]: currentAreaStats,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error actualizando progreso desde intento:', error);
    }
  }

  _getAreaKey(areaName) {
    const areaMap = {
      'Matemáticas': 'matematicas',
      'Lectura Crítica': 'lecturaCritica',
      'Ciencias Naturales': 'cienciasNaturales'
    };
    return areaMap[areaName] || 'matematicas';
  }
}

export default new ProgressFirestoreService();
