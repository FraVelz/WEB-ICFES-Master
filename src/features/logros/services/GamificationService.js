/**
 * GAMIFICATION SERVICE - Gestión de badges, niveles y recompensas
 * Maneja: puntos XP, niveles, badges desbloqueados, monedas
 */

import BaseService from '@/services/BaseService';

class GamificationService extends BaseService {
  constructor() {
    super('gamification');
  }

  // ============ DEFINICIÓN DE BADGES ============

  static BADGES = {
    // Badges por milestones de preguntas
    first_question: {
      id: 'first_question',
      name: 'Primer Paso',
      description: 'Responder tu primera pregunta',
      icon: '🎯',
      points: 10,
    },
    hundred_questions: {
      id: 'hundred_questions',
      name: 'Centenario',
      description: 'Responder 100 preguntas',
      icon: '💯',
      points: 100,
    },
    thousand_questions: {
      id: 'thousand_questions',
      name: 'Millenial',
      description: 'Responder 1000 preguntas',
      icon: '🏆',
      points: 500,
    },
    // Badges por precisión
    perfect_area: {
      id: 'perfect_area',
      name: 'Especialista',
      description: 'Lograr 100% en un área completa',
      icon: '⭐',
      points: 200,
    },
    high_accuracy: {
      id: 'high_accuracy',
      name: 'Precisión',
      description: 'Mantener 90%+ de precisión',
      icon: '🎯',
      points: 150,
    },
    // Badges por racha
    week_streak: {
      id: 'week_streak',
      name: 'Consistencia',
      description: 'Mantener racha de 7 días',
      icon: '🔥',
      points: 100,
    },
    month_streak: {
      id: 'month_streak',
      name: 'Dedicación',
      description: 'Mantener racha de 30 días',
      icon: '💪',
      points: 300,
    },
    // Badges por tiempo
    early_bird: {
      id: 'early_bird',
      name: 'Madrugador',
      description: 'Estudiar entre 5-7 AM',
      icon: '🌅',
      points: 50,
    },
    night_owl: {
      id: 'night_owl',
      name: 'Búho Nocturno',
      description: 'Estudiar entre 10 PM-12 AM',
      icon: '🌙',
      points: 50,
    },
  };

  // ============ NIVELES ============

  static LEVELS = [
    { level: 1, xpRequired: 0, title: 'Aprendiz', icon: '📚' },
    { level: 2, xpRequired: 100, title: 'Estudiante', icon: '✏️' },
    { level: 3, xpRequired: 300, title: 'Investigador', icon: '🔍' },
    { level: 4, xpRequired: 600, title: 'Experto', icon: '🧠' },
    { level: 5, xpRequired: 1000, title: 'Maestro', icon: '👑' },
  ];

  /**
   * Obtener perfil de gamificación del usuario
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getProfile(userId) {
    try {
      const profile = await this.get(userId);
      return profile || this._initializeGamificationProfile(userId);
    } catch (error) {
      console.error('Error obteniendo perfil de gamificación:', error);
      throw error;
    }
  }

  /**
   * Añadir puntos XP al usuario
   * @param {string} userId
   * @param {number} points
   * @param {string} reason
   * @returns {Promise<Object>}
   */
  async addXP(userId, points, reason = 'actividad') {
    const profile = await this.getProfile(userId);

    profile.totalXP = (profile.totalXP || 0) + points;
    profile.currentXP = (profile.currentXP || 0) + points;

    // Verificar si sube de nivel
    const newLevel = this._calculateLevel(profile.totalXP);
    if (newLevel > profile.level) {
      profile.level = newLevel;
      profile.levelUpNotification = {
        message: `¡Felicidades! Alcanzaste nivel ${newLevel}: ${GamificationService.LEVELS[newLevel - 1].title}`,
        timestamp: new Date().toISOString(),
      };
    }

    // Registrar transacción
    if (!profile.xpHistory) profile.xpHistory = [];
    profile.xpHistory.push({
      date: new Date().toISOString(),
      points,
      reason,
    });

    return this.update(userId, profile);
  }

  /**
   * Añadir monedas al usuario
   * @param {string} userId
   * @param {number} coins
   * @param {string} reason
   * @returns {Promise<Object>}
   */
  async addCoins(userId, coins, reason = 'recompensa') {
    const profile = await this.getProfile(userId);

    profile.totalCoins = (profile.totalCoins || 0) + coins;
    profile.spentCoins = profile.spentCoins || 0;

    // Registrar transacción
    if (!profile.coinsHistory) profile.coinsHistory = [];
    profile.coinsHistory.push({
      date: new Date().toISOString(),
      amount: coins,
      reason,
      type: 'earn',
    });

    return this.update(userId, profile);
  }

  /**
   * Gastar monedas
   * @param {string} userId
   * @param {number} coins
   * @param {string} item
   * @returns {Promise<Object>}
   */
  async spendCoins(userId, coins, item = 'item') {
    const profile = await this.getProfile(userId);
    const availableCoins = profile.totalCoins - profile.spentCoins;

    if (availableCoins < coins) {
      throw new Error('Monedas insuficientes');
    }

    profile.spentCoins = (profile.spentCoins || 0) + coins;

    // Registrar transacción
    if (!profile.coinsHistory) profile.coinsHistory = [];
    profile.coinsHistory.push({
      date: new Date().toISOString(),
      amount: coins,
      item,
      type: 'spend',
    });

    return this.update(userId, profile);
  }

  /**
   * Desbloquear un badge
   * @param {string} userId
   * @param {string} badgeId
   * @returns {Promise<Object>}
   */
  async unlockBadge(userId, badgeId) {
    const badge = GamificationService.BADGES[badgeId];
    if (!badge) {
      throw new Error(`Badge ${badgeId} no existe`);
    }

    const profile = await this.getProfile(userId);

    // Verificar si ya tiene el badge
    if (profile.badges?.some((b) => b.id === badgeId)) {
      return profile; // Ya desbloqueado
    }

    // Agregar badge
    if (!profile.badges) profile.badges = [];
    profile.badges.push({
      ...badge,
      unlockedAt: new Date().toISOString(),
    });

    // Añadir puntos XP por desbloquear badge
    profile.totalXP = (profile.totalXP || 0) + badge.points;

    return this.update(userId, profile);
  }

  /**
   * Obtener todos los badges desbloqueados
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  async getBadges(userId) {
    const profile = await this.getProfile(userId);
    return profile.badges || [];
  }

  /**
   * Obtener nivel actual del usuario
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getLevel(userId) {
    const profile = await this.getProfile(userId);
    const levelInfo = GamificationService.LEVELS[profile.level - 1];
    const nextLevel =
      GamificationService.LEVELS[profile.level] ||
      GamificationService.LEVELS[GamificationService.LEVELS.length - 1];

    return {
      current: {
        level: profile.level,
        title: levelInfo?.title,
        icon: levelInfo?.icon,
      },
      next: {
        level: nextLevel.level,
        title: nextLevel.title,
        icon: nextLevel.icon,
        xpRequired: nextLevel.xpRequired,
      },
      totalXP: profile.totalXP,
      currentXP: profile.currentXP,
      xpProgress:
        ((profile.totalXP -
          GamificationService.LEVELS[profile.level - 1].xpRequired) /
          (nextLevel.xpRequired -
            GamificationService.LEVELS[profile.level - 1].xpRequired)) *
        100,
    };
  }

  /**
   * Obtener información de monedas
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getCoinsInfo(userId) {
    const profile = await this.getProfile(userId);
    return {
      total: profile.totalCoins || 0,
      available: (profile.totalCoins || 0) - (profile.spentCoins || 0),
      spent: profile.spentCoins || 0,
    };
  }

  /**
   * Verificar y asignar badges automáticos basado en eventos
   * @param {string} userId
   * @param {Object} context - Información del evento (área, preguntas respondidas, etc)
   * @returns {Promise<Array>} - Badges desbloqueados en esta llamada
   */
  async checkAndUnlockAchievements(userId, context = {}) {
    const unlockedBadges = [];

    // Verificar logros basado en contexto
    if (context.totalQuestionsAnswered === 1) {
      await this.unlockBadge(userId, 'first_question');
      unlockedBadges.push('first_question');
    }
    if (context.totalQuestionsAnswered === 100) {
      await this.unlockBadge(userId, 'hundred_questions');
      unlockedBadges.push('hundred_questions');
    }
    if (context.totalQuestionsAnswered === 1000) {
      await this.unlockBadge(userId, 'thousand_questions');
      unlockedBadges.push('thousand_questions');
    }
    if (context.streak === 7) {
      await this.unlockBadge(userId, 'week_streak');
      unlockedBadges.push('week_streak');
    }
    if (context.streak === 30) {
      await this.unlockBadge(userId, 'month_streak');
      unlockedBadges.push('month_streak');
    }

    return unlockedBadges;
  }

  /**
   * Obtener leaderboard (top 10 usuarios)
   * @returns {Promise<Array>}
   */
  async getLeaderboard() {
    try {
      const allProfiles = await this.get();
      return allProfiles
        .sort((a, b) => (b.totalXP || 0) - (a.totalXP || 0))
        .slice(0, 10)
        .map((profile, index) => ({
          rank: index + 1,
          userId: profile.id,
          level: profile.level,
          totalXP: profile.totalXP || 0,
          badges: profile.badges?.length || 0,
        }));
    } catch (error) {
      console.error('Error obteniendo leaderboard:', error);
      return [];
    }
  }

  /**
   * Resetear gamificación (para pruebas)
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async reset(userId) {
    return this.update(userId, this._initializeGamificationProfile(userId));
  }

  // ============ MÉTODOS PRIVADOS ============

  _initializeGamificationProfile(userId) {
    return {
      id: userId,
      userId,
      level: 1,
      totalXP: 0,
      currentXP: 0,
      totalCoins: 0,
      spentCoins: 0,
      badges: [],
      xpHistory: [],
      coinsHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  _calculateLevel(totalXP) {
    let level = 1;
    for (let lvlInfo of GamificationService.LEVELS) {
      if (totalXP >= lvlInfo.xpRequired) {
        level = lvlInfo.level;
      } else {
        break;
      }
    }
    return level;
  }
}

export default new GamificationService();
