/**
 * GAMIFICATION SERVICE - Gestión de badges, niveles y recompensas
 * Maneja: puntos XP, niveles, badges desbloqueados, monedas
 */

import BaseService from '@/services/BaseService';

export interface GamificationProfile {
  id?: string;
  userId?: string;
  level?: number;
  totalXP?: number;
  currentXP?: number;
  totalCoins?: number;
  spentCoins?: number;
  badges?: { id: string; [key: string]: unknown }[];
  xpHistory?: { date: string; points: number; reason: string }[];
  coinsHistory?: { date: string; amount: number; reason?: string; item?: string; type: string }[];
  levelUpNotification?: { message: string; timestamp: string };
  createdAt?: string;
  updatedAt?: string;
}

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
   */
  async getProfile(userId: string): Promise<GamificationProfile> {
    try {
      const profile = (await this.get(userId)) as GamificationProfile | null;
      return profile ?? this._initializeGamificationProfile(userId);
    } catch (error) {
      console.error('Error obteniendo perfil de gamificación:', error);
      throw error;
    }
  }

  /**
   * Añadir puntos XP al usuario
   */
  async addXP(userId: string, points: number, reason = 'actividad') {
    const profile = await this.getProfile(userId);

    profile.totalXP = (profile.totalXP ?? 0) + points;
    profile.currentXP = (profile.currentXP ?? 0) + points;

    const newLevel = this._calculateLevel(profile.totalXP ?? 0);
    if (newLevel > (profile.level ?? 0)) {
      profile.level = newLevel;
      const levelInfo = GamificationService.LEVELS[newLevel - 1];
      profile.levelUpNotification = {
        message: `¡Felicidades! Alcanzaste nivel ${newLevel}: ${levelInfo?.title ?? ''}`,
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
   */
  async addCoins(userId: string, coins: number, reason = 'recompensa') {
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
   */
  async spendCoins(userId: string, coins: number, item = 'item') {
    const profile = await this.getProfile(userId);
    const availableCoins = (profile.totalCoins ?? 0) - (profile.spentCoins ?? 0);

    if (availableCoins < coins) {
      throw new Error('Monedas insuficientes');
    }

    profile.spentCoins = (profile.spentCoins ?? 0) + coins;

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
   */
  async unlockBadge(userId: string, badgeId: string) {
    const badge = (GamificationService.BADGES as Record<string, { id: string; points: number }>)[badgeId];
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

    profile.totalXP = (profile.totalXP ?? 0) + (badge?.points ?? 0);

    return this.update(userId, profile);
  }

  /**
   * Obtener todos los badges desbloqueados
   */
  async getBadges(userId: string) {
    const profile = await this.getProfile(userId);
    return profile.badges || [];
  }

  /**
   * Obtener nivel actual del usuario
   */
  async getLevel(userId: string) {
    const profile = await this.getProfile(userId);
    const currentLevel = profile.level ?? 1;
    const levelInfo = GamificationService.LEVELS[currentLevel - 1];
    const nextLevel =
      GamificationService.LEVELS[currentLevel] ??
      GamificationService.LEVELS[GamificationService.LEVELS.length - 1];
    const prevXp = levelInfo?.xpRequired ?? 0;
    const nextXp = nextLevel?.xpRequired ?? 0;
    const totalXP = profile.totalXP ?? 0;
    const xpProgress =
      nextXp > prevXp
        ? ((totalXP - prevXp) / (nextXp - prevXp)) * 100
        : 100;

    return {
      current: {
        level: currentLevel,
        title: levelInfo?.title,
        icon: levelInfo?.icon,
      },
      next: {
        level: nextLevel?.level,
        title: nextLevel?.title,
        icon: nextLevel?.icon,
        xpRequired: nextXp,
      },
      totalXP,
      currentXP: profile.currentXP ?? 0,
      xpProgress,
    };
  }

  /**
   * Obtener información de monedas
   */
  async getCoinsInfo(userId: string) {
    const profile = await this.getProfile(userId);
    return {
      total: profile.totalCoins || 0,
      available: (profile.totalCoins || 0) - (profile.spentCoins || 0),
      spent: profile.spentCoins || 0,
    };
  }

  /**
   * Verificar y asignar badges automáticos basado en eventos
   */
  async checkAndUnlockAchievements(
    userId: string,
    context: { totalQuestionsAnswered?: number; streak?: number } = {}
  ) {
    const unlockedBadges: string[] = [];

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
   */
  async getLeaderboard() {
    try {
      const allProfiles = (await this.get()) as GamificationProfile[];
      const profiles = Array.isArray(allProfiles) ? allProfiles : [];
      return profiles
        .sort((a, b) => (b.totalXP ?? 0) - (a.totalXP ?? 0))
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
   */
  async reset(userId: string) {
    return this.update(userId, this._initializeGamificationProfile(userId));
  }

  // ============ MÉTODOS PRIVADOS ============

  _initializeGamificationProfile(userId: string): GamificationProfile {
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

  _calculateLevel(totalXP: number): number {
    let level = 1;
    for (const lvlInfo of GamificationService.LEVELS) {
      if (totalXP >= lvlInfo.xpRequired) {
        level = lvlInfo.level;
      } else {
        break;
      }
    }
    return level;
  }
}

const gamificationServiceInstance = new GamificationService();
export default gamificationServiceInstance;
export { GamificationService };
