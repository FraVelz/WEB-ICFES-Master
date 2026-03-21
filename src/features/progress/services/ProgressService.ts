/**
 * PROGRESS SERVICE - Gestión de progreso y estadísticas del usuario
 * Maneja: estadísticas por área, racha de días, recomendaciones
 */

import BaseService from '@/services/BaseService';

export interface AreaStat {
  area: string;
  questionsAnswered: number;
  correctAnswers: number;
  percentage?: number;
  difficulty?: Record<string, number>;
}

export interface ProgressStats {
  id?: string;
  userId?: string;
  totalQuestionsAnswered?: number;
  correctAnswers?: number;
  currentStreak?: number;
  maxStreak?: number;
  areaStats?: Record<string, AreaStat>;
  lastStreakUpdate?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AnswerData {
  isCorrect: boolean;
  area: string;
  difficulty?: string;
  timeSpent?: number;
}

class ProgressService extends BaseService {
  constructor() {
    super('progress');
  }

  /**
   * Obtener estadísticas completas del usuario
   */
  async getUserStats(userId: string): Promise<ProgressStats> {
    try {
      const stats = (await this.get(userId)) as ProgressStats | null;
      return stats ?? this._initializeDefaultStats(userId);
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }

  /**
   * Actualizar estadísticas después de completar una pregunta
   */
  async updateAfterAnswer(userId: string, answerData: AnswerData) {
    const stats = await this.getUserStats(userId);

    stats.totalQuestionsAnswered = (stats.totalQuestionsAnswered ?? 0) + 1;
    if (answerData.isCorrect) {
      stats.correctAnswers = (stats.correctAnswers ?? 0) + 1;
      stats.currentStreak = (stats.currentStreak ?? 0) + 1;
    } else {
      stats.currentStreak = 0;
    }

    // Actualizar racha máxima
    stats.maxStreak = Math.max(stats.maxStreak ?? 0, stats.currentStreak ?? 0);

    if (!stats.areaStats) stats.areaStats = {};
    if (!stats.areaStats[answerData.area]) {
      stats.areaStats[answerData.area] = {
        area: answerData.area,
        questionsAnswered: 0,
        correctAnswers: 0,
        difficulty: { facil: 0, media: 0, dificil: 0 },
      };
    }

    stats.areaStats[answerData.area].questionsAnswered++;
    if (answerData.isCorrect) {
      stats.areaStats[answerData.area].correctAnswers++;
    }
    const diffKey = answerData.difficulty ?? 'media';
    const diff = stats.areaStats[answerData.area].difficulty ?? {
      facil: 0,
      media: 0,
      dificil: 0,
    };
    diff[diffKey] = (diff[diffKey] ?? 0) + 1;
    stats.areaStats[answerData.area].difficulty = diff;

    // Calcular porcentaje correctas por área
    const area = stats.areaStats[answerData.area];
    area.percentage = Math.round(
      (area.correctAnswers / area.questionsAnswered) * 100
    );

    return this.update(userId, stats);
  }

  /**
   * Obtener estadísticas por área específica
   */
  async getAreaStats(userId: string, area: string) {
    const stats = await this.getUserStats(userId);
    return stats.areaStats?.[area] || null;
  }

  /**
   * Obtener todas las estadísticas por área
   */
  async getAllAreaStats(userId: string) {
    const stats = await this.getUserStats(userId);
    return Object.values(stats.areaStats || {});
  }

  /**
   * Obtener racha actual
   */
  async getStreak(userId: string) {
    const stats = await this.getUserStats(userId);
    return {
      current: stats.currentStreak || 0,
      max: stats.maxStreak || 0,
      lastUpdated: stats.lastStreakUpdate || null,
    };
  }

  /**
   * Actualizar racha diaria
   */
  async updateDailyStreak(userId: string) {
    const stats = await this.getUserStats(userId);
    const today = new Date().toDateString();
    const lastUpdate = stats.lastStreakUpdate
      ? new Date(stats.lastStreakUpdate).toDateString()
      : null;

    if (lastUpdate !== today) {
      stats.currentStreak = (stats.currentStreak ?? 0) + 1;
      stats.maxStreak = Math.max(stats.maxStreak ?? 0, stats.currentStreak ?? 0);
      stats.lastStreakUpdate = new Date().toISOString();
    }

    return this.update(userId, stats);
  }

  /**
   * Obtener recomendaciones basadas en desempeño
   */
  async getRecommendations(userId: string) {
    const stats = await this.getUserStats(userId);
    const recommendations: { type: string; area: string; message: string; priority: number; icon: string }[] = [];

    Object.values(stats.areaStats ?? {}).forEach((area: AreaStat) => {
      const pct = area.percentage ?? 0;
      if (pct < 60) {
        recommendations.push({
          type: 'priority',
          area: area.area,
          message: `Necesitas reforzar ${area.area}. Tu desempeño es del ${pct}%`,
          priority: 100 - pct,
          icon: '🎯',
        });
      } else if (pct < 80) {
        recommendations.push({
          type: 'improvement',
          area: area.area,
          message: `${area.area} va bien (${pct}%), pero puede mejorar`,
          priority: 80 - pct,
          icon: '📈',
        });
      }
    });

    // Ordenar por prioridad
    return recommendations.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Obtener análisis de desempeño temporal
   */
  async getPerformanceAnalysis(userId: string, days = 7) {
    const stats = await this.getUserStats(userId);

    return {
      totalQuestions: stats.totalQuestionsAnswered ?? 0,
      correctAnswers: stats.correctAnswers ?? 0,
      accuracy: (stats.totalQuestionsAnswered ?? 0) > 0
        ? Math.round(
            ((stats.correctAnswers ?? 0) / (stats.totalQuestionsAnswered ?? 1)) * 100
          )
        : 0,
      streak: stats.currentStreak ?? 0,
      maxStreak: stats.maxStreak ?? 0,
      topArea: this._getTopArea(stats.areaStats),
      weakArea: this._getWeakestArea(stats.areaStats),
      period: `Últimos ${days} días`,
    };
  }

  /**
   * Resetear progreso (para pruebas)
   */
  async resetProgress(userId: string) {
    return this.update(userId, this._initializeDefaultStats(userId));
  }

  // ============ MÉTODOS PRIVADOS ============

  _initializeDefaultStats(userId: string): ProgressStats {
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
      updatedAt: new Date().toISOString(),
    };
  }

  _getTopArea(areaStats: Record<string, AreaStat> | undefined): AreaStat | null {
    if (!areaStats || Object.keys(areaStats).length === 0) return null;
    const values = Object.values(areaStats);
    return values.reduce((max, area) =>
      (area.percentage ?? 0) > (max.percentage ?? 0) ? area : max
    , values[0]!);
  }

  _getWeakestArea(areaStats: Record<string, AreaStat> | undefined): AreaStat | null {
    if (!areaStats || Object.keys(areaStats).length === 0) return null;
    const values = Object.values(areaStats);
    return values.reduce((min, area) =>
      (area.percentage ?? 100) < (min.percentage ?? 100) ? area : min
    , values[0]!);
  }
}

export default new ProgressService();
