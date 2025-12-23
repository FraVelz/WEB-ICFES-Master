/**
 * PROGRESS SERVICE - Gestión de progreso y estadísticas del usuario
 * Maneja: estadísticas por área, racha de días, recomendaciones
 */

import BaseService from '@/services/BaseService';

class ProgressService extends BaseService {
  constructor() {
    super('progress');
  }

  /**
   * Obtener estadísticas completas del usuario
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getUserStats(userId) {
    try {
      const stats = await this.get(userId);
      return stats || this._initializeDefaultStats(userId);
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }

  /**
   * Actualizar estadísticas después de completar una pregunta
   * @param {string} userId
   * @param {Object} answerData - {isCorrect, area, difficulty, timeSpent}
   * @returns {Promise<Object>}
   */
  async updateAfterAnswer(userId, answerData) {
    const stats = await this.getUserStats(userId);

    // Actualizar contadores generales
    stats.totalQuestionsAnswered = (stats.totalQuestionsAnswered || 0) + 1;
    if (answerData.isCorrect) {
      stats.correctAnswers = (stats.correctAnswers || 0) + 1;
      stats.currentStreak = (stats.currentStreak || 0) + 1;
    } else {
      stats.currentStreak = 0;
    }

    // Actualizar racha máxima
    stats.maxStreak = Math.max(stats.maxStreak || 0, stats.currentStreak || 0);

    // Actualizar estadísticas por área
    if (!stats.areaStats) stats.areaStats = {};
    if (!stats.areaStats[answerData.area]) {
      stats.areaStats[answerData.area] = {
        area: answerData.area,
        questionsAnswered: 0,
        correctAnswers: 0,
        difficulty: { facil: 0, media: 0, dificil: 0 }
      };
    }

    stats.areaStats[answerData.area].questionsAnswered++;
    if (answerData.isCorrect) {
      stats.areaStats[answerData.area].correctAnswers++;
    }
    stats.areaStats[answerData.area].difficulty[answerData.difficulty || 'media']++;

    // Calcular porcentaje correctas por área
    const area = stats.areaStats[answerData.area];
    area.percentage = Math.round((area.correctAnswers / area.questionsAnswered) * 100);

    return this.update(userId, stats);
  }

  /**
   * Obtener estadísticas por área específica
   * @param {string} userId
   * @param {string} area
   * @returns {Promise<Object>}
   */
  async getAreaStats(userId, area) {
    const stats = await this.getUserStats(userId);
    return stats.areaStats?.[area] || null;
  }

  /**
   * Obtener todas las estadísticas por área
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  async getAllAreaStats(userId) {
    const stats = await this.getUserStats(userId);
    return Object.values(stats.areaStats || {});
  }

  /**
   * Obtener racha actual
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getStreak(userId) {
    const stats = await this.getUserStats(userId);
    return {
      current: stats.currentStreak || 0,
      max: stats.maxStreak || 0,
      lastUpdated: stats.lastStreakUpdate || null
    };
  }

  /**
   * Actualizar racha diaria
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async updateDailyStreak(userId) {
    const stats = await this.getUserStats(userId);
    const today = new Date().toDateString();
    const lastUpdate = stats.lastStreakUpdate ? new Date(stats.lastStreakUpdate).toDateString() : null;

    if (lastUpdate !== today) {
      stats.currentStreak = (stats.currentStreak || 0) + 1;
      stats.maxStreak = Math.max(stats.maxStreak || 0, stats.currentStreak);
      stats.lastStreakUpdate = new Date().toISOString();
    }

    return this.update(userId, stats);
  }

  /**
   * Obtener recomendaciones basadas en desempeño
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  async getRecommendations(userId) {
    const stats = await this.getUserStats(userId);
    const recommendations = [];

    // Analizar áreas débiles
    Object.values(stats.areaStats || {}).forEach(area => {
      if (area.percentage < 60) {
        recommendations.push({
          type: 'priority',
          area: area.area,
          message: `Necesitas reforzar ${area.area}. Tu desempeño es del ${area.percentage}%`,
          priority: 100 - area.percentage,
          icon: '🎯'
        });
      } else if (area.percentage < 80) {
        recommendations.push({
          type: 'improvement',
          area: area.area,
          message: `${area.area} va bien (${area.percentage}%), pero puede mejorar`,
          priority: 80 - area.percentage,
          icon: '📈'
        });
      }
    });

    // Ordenar por prioridad
    return recommendations.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Obtener análisis de desempeño temporal
   * @param {string} userId
   * @param {number} days - Últimos N días
   * @returns {Promise<Object>}
   */
  async getPerformanceAnalysis(userId, days = 7) {
    const stats = await this.getUserStats(userId);
    
    return {
      totalQuestions: stats.totalQuestionsAnswered || 0,
      correctAnswers: stats.correctAnswers || 0,
      accuracy: stats.totalQuestionsAnswered 
        ? Math.round((stats.correctAnswers / stats.totalQuestionsAnswered) * 100)
        : 0,
      streak: stats.currentStreak || 0,
      maxStreak: stats.maxStreak || 0,
      topArea: this._getTopArea(stats.areaStats),
      weakArea: this._getWeakestArea(stats.areaStats),
      period: `Últimos ${days} días`
    };
  }

  /**
   * Resetear progreso (para pruebas)
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async resetProgress(userId) {
    return this.update(userId, this._initializeDefaultStats(userId));
  }

  // ============ MÉTODOS PRIVADOS ============

  _initializeDefaultStats(userId) {
    return {
      id: userId,
      userId,
      totalQuestionsAnswered: 0,
      correctAnswers: 0,
      currentStreak: 0,
      maxStreak: 0,
      areaStats: {},
      lastStreakUpdate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  _getTopArea(areaStats) {
    if (!areaStats || Object.keys(areaStats).length === 0) return null;
    return Object.values(areaStats).reduce((max, area) =>
      (area.percentage || 0) > (max.percentage || 0) ? area : max
    );
  }

  _getWeakestArea(areaStats) {
    if (!areaStats || Object.keys(areaStats).length === 0) return null;
    return Object.values(areaStats).reduce((min, area) =>
      (area.percentage || 100) < (min.percentage || 100) ? area : min
    );
  }
}

export default new ProgressService();
