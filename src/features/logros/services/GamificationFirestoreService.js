import { db } from '@/config/firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';

/**
 * Badges disponibles
 */
export const BADGES = {
  FIRST_QUESTION: {
    id: 'first_question',
    name: 'Primera Pregunta',
    description: 'Responde tu primera pregunta',
    icon: '🚀'
  },
  STREAK_7: {
    id: 'streak_7',
    name: 'En Racha',
    description: 'Mantén una racha de 7 días',
    icon: '🔥'
  },
  HUNDRED_QUESTIONS: {
    id: 'hundred_questions',
    name: 'Centenario',
    description: 'Responde 100 preguntas',
    icon: '💯'
  },
  NINETY_PERCENT: {
    id: 'ninety_percent',
    name: 'Genio',
    description: 'Alcanza 90% de precisión',
    icon: '🧠'
  },
  PERFECT_EXAM: {
    id: 'perfect_exam',
    name: 'Perfecto',
    description: 'Completa un examen con 100%',
    icon: '⭐'
  },
  AREA_MASTER_MATH: {
    id: 'area_master_math',
    name: 'Maestro de Matemáticas',
    description: '80% en Matemáticas',
    icon: '📐'
  },
  AREA_MASTER_LANGUAGE: {
    id: 'area_master_language',
    name: 'Maestro de Lenguaje',
    description: '80% en Lectura Crítica',
    icon: '📚'
  },
  AREA_MASTER_SCIENCE: {
    id: 'area_master_science',
    name: 'Maestro de Ciencias',
    description: '80% en Ciencias Naturales',
    icon: '🔬'
  },
  NIGHT_OWL: {
    id: 'night_owl',
    name: 'Búho Nocturno',
    description: 'Estudia después de las 11 PM',
    icon: '🦉'
  }
};

/**
 * Niveles disponibles
 */
export const LEVELS = [
  {
    level: 1,
    name: 'Aprendiz',
    icon: '📚',
    minXP: 0,
    maxXP: 1000,
    color: 'from-blue-400 to-blue-600'
  },
  {
    level: 2,
    name: 'Estudiante',
    icon: '📖',
    minXP: 1000,
    maxXP: 3000,
    color: 'from-cyan-400 to-cyan-600'
  },
  {
    level: 3,
    name: 'Profesional',
    icon: '💼',
    minXP: 3000,
    maxXP: 6000,
    color: 'from-green-400 to-green-600'
  },
  {
    level: 4,
    name: 'Experto',
    icon: '🎓',
    minXP: 6000,
    maxXP: 10000,
    color: 'from-purple-400 to-purple-600'
  },
  {
    level: 5,
    name: 'Maestro',
    icon: '👑',
    minXP: 10000,
    maxXP: null,
    color: 'from-yellow-400 to-yellow-600'
  }
];

/**
 * Servicio de Firestore para gestionar gamificación
 */
class GamificationFirestoreService {
  constructor() {
    this.collectionPath = 'users';
    this.subcollectionName = 'gamification';
  }

  /**
   * Crear perfil de gamificación inicial
   */
  async createGamificationProfile(userId) {
    try {
      const gamRef = doc(db, this.collectionPath, userId, this.subcollectionName, 'current');
      
      const defaultProfile = {
        userId,
        totalXP: 0,
        level: 1,
        virtualMoney: 0,
        badges: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        achievements: []
      };

      await setDoc(gamRef, defaultProfile);
      return defaultProfile;
    } catch (error) {
      console.error('Error creando perfil de gamificación:', error);
      throw error;
    }
  }

  /**
   * Obtener perfil de gamificación
   */
  async getProfile(userId) {
    try {
      const gamRef = doc(db, this.collectionPath, userId, this.subcollectionName, 'current');
      const gamSnap = await getDoc(gamRef);

      if (!gamSnap.exists()) {
        return this._getDefaultProfile(userId);
      }

      return gamSnap.data();
    } catch (error) {
      console.error('Error obteniendo perfil de gamificación:', error);
      return this._getDefaultProfile(userId);
    }
  }

  /**
   * Agregar XP
   */
  async addXP(userId, points, reason = 'activity') {
    try {
      const profile = await this.getProfile(userId);
      const newXP = profile.totalXP + points;
      const newLevel = this._calculateLevel(newXP);

      const gamRef = doc(db, this.collectionPath, userId, this.subcollectionName, 'current');
      
      const updateData = {
        totalXP: newXP,
        level: newLevel,
        updatedAt: Timestamp.now()
      };

      // Guardar evento de XP
      const eventRef = doc(collection(db, this.collectionPath, userId, 'xp_events'), `event_${Date.now()}`);
      await setDoc(eventRef, {
        points,
        reason,
        newTotal: newXP,
        timestamp: Timestamp.now()
      });

      await updateDoc(gamRef, updateData);
      return { totalXP: newXP, level: newLevel };
    } catch (error) {
      console.error('Error agregando XP:', error);
      throw error;
    }
  }

  /**
   * Agregar monedas
   */
  async addCoins(userId, amount, reason = 'reward') {
    try {
      const profile = await this.getProfile(userId);
      const currentVirtualMoney = profile.virtualMoney || profile.coins || 0; // Compatibilidad con datos antiguos
      const newCoins = currentVirtualMoney + amount;

      const gamRef = doc(db, this.collectionPath, userId, this.subcollectionName, 'current');
      
      // Guardar evento de monedas
      const eventRef = doc(collection(db, this.collectionPath, userId, 'coin_events'), `event_${Date.now()}`);
      await setDoc(eventRef, {
        amount,
        reason,
        type: 'earn',
        newTotal: newCoins,
        timestamp: Timestamp.now()
      });

      await updateDoc(gamRef, {
        virtualMoney: newCoins,
        updatedAt: Timestamp.now()
      });

      return { coins: newCoins, virtualMoney: newCoins };
    } catch (error) {
      console.error('Error agregando monedas:', error);
      throw error;
    }
  }

  /**
   * Gastar monedas
   */
  async spendCoins(userId, amount, item = 'purchase') {
    try {
      const profile = await this.getProfile(userId);
      const currentVirtualMoney = profile.virtualMoney || profile.coins || 0; // Compatibilidad con datos antiguos

      if (currentVirtualMoney < amount) {
        throw new Error('Monedas insuficientes');
      }

      const newCoins = currentVirtualMoney - amount;

      const gamRef = doc(db, this.collectionPath, userId, this.subcollectionName, 'current');
      
      // Guardar evento de gasto
      const eventRef = doc(collection(db, this.collectionPath, userId, 'coin_events'), `event_${Date.now()}`);
      await setDoc(eventRef, {
        amount,
        item,
        type: 'spend',
        newTotal: newCoins,
        timestamp: Timestamp.now()
      });

      await updateDoc(gamRef, {
        virtualMoney: newCoins,
        updatedAt: Timestamp.now()
      });

      return { coins: newCoins, virtualMoney: newCoins };
    } catch (error) {
      console.error('Error gastando monedas:', error);
      throw error;
    }
  }

  /**
   * Desbloquear badge
   */
  async unlockBadge(userId, badgeId) {
    try {
      const profile = await this.getProfile(userId);
      const badges = profile.badges || [];

      if (!badges.includes(badgeId)) {
        badges.push(badgeId);

        const gamRef = doc(db, this.collectionPath, userId, this.subcollectionName, 'current');
        await updateDoc(gamRef, {
          badges,
          updatedAt: Timestamp.now()
        });

        // Recompensa por desbloquear badge
        await this.addCoins(userId, 50, `badge_${badgeId}`);
      }

      return { badges };
    } catch (error) {
      console.error('Error desbloqueando badge:', error);
      throw error;
    }
  }

  /**
   * Obtener badges del usuario
   */
  async getBadges(userId) {
    try {
      const profile = await this.getProfile(userId);
      const unlockedIds = profile.badges || [];

      return unlockedIds.map(id => BADGES[Object.keys(BADGES).find(k => BADGES[k].id === id)] || {}).filter(b => b.id);
    } catch (error) {
      console.error('Error obteniendo badges:', error);
      return [];
    }
  }

  /**
   * Obtener información de nivel
   */
  async getLevel(userId) {
    try {
      const profile = await this.getProfile(userId);
      const currentLevel = LEVELS.find(l => l.level === profile.level);
      const nextLevel = LEVELS.find(l => l.level === profile.level + 1);

      const xpInCurrentLevel = profile.totalXP - currentLevel.minXP;
      const xpNeededForNextLevel = nextLevel 
        ? nextLevel.minXP - currentLevel.minXP 
        : currentLevel.maxXP - currentLevel.minXP;

      return {
        current: currentLevel,
        next: nextLevel,
        totalXP: profile.totalXP,
        xpProgress: {
          current: xpInCurrentLevel,
          needed: xpNeededForNextLevel,
          percentage: Math.round((xpInCurrentLevel / xpNeededForNextLevel) * 100)
        }
      };
    } catch (error) {
      console.error('Error obteniendo información de nivel:', error);
      throw error;
    }
  }

  /**
   * Obtener información de monedas
   */
  async getCoinsInfo(userId) {
    try {
      const profile = await this.getProfile(userId);
      const currentVirtualMoney = profile.virtualMoney || profile.coins || 0; // Compatibilidad con datos antiguos
      
      // Obtener historial de gastos
      const coinEventsRef = collection(db, this.collectionPath, userId, 'coin_events');
      const eventsSnap = await getDocs(coinEventsRef);

      let spent = 0;
      eventsSnap.forEach(doc => {
        const event = doc.data();
        if (event.type === 'spend') {
          spent += event.amount;
        }
      });

      return {
        total: currentVirtualMoney,
        available: currentVirtualMoney,
        spent,
        virtualMoney: currentVirtualMoney
      };
    } catch (error) {
      console.error('Error obteniendo información de monedas:', error);
      throw error;
    }
  }

  /**
   * Verificar y desbloquear logros
   */
  async checkAndUnlockAchievements(userId, context) {
    try {
      const profile = await this.getProfile(userId);

      // Primera pregunta
      if (context.totalQuestionsAnswered >= 1 && !profile.badges?.includes(BADGES.FIRST_QUESTION.id)) {
        await this.unlockBadge(userId, BADGES.FIRST_QUESTION.id);
      }

      // Racha de 7 días
      if (context.streak >= 7 && !profile.badges?.includes(BADGES.STREAK_7.id)) {
        await this.unlockBadge(userId, BADGES.STREAK_7.id);
      }

      // 100 preguntas
      if (context.totalQuestionsAnswered >= 100 && !profile.badges?.includes(BADGES.HUNDRED_QUESTIONS.id)) {
        await this.unlockBadge(userId, BADGES.HUNDRED_QUESTIONS.id);
      }

      // 90% precisión
      if (context.accuracy >= 90 && !profile.badges?.includes(BADGES.NINETY_PERCENT.id)) {
        await this.unlockBadge(userId, BADGES.NINETY_PERCENT.id);
      }

      return profile;
    } catch (error) {
      console.error('Error verificando logros:', error);
      throw error;
    }
  }

  /**
   * Obtener leaderboard
   */
  async getLeaderboard(limit_num = 10) {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('totalXP', 'desc'), limit(limit_num));

      const querySnapshot = await getDocs(q);
      const leaderboard = [];

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        leaderboard.push({
          userId: doc.id,
          username: userData.username || userData.displayName || 'Anónimo',
          totalXP: userData.totalXP || 0,
          level: userData.level || 1,
          profileImage: userData.profileImage || userData.photoURL || null
        });
      });

      return leaderboard;
    } catch (error) {
      console.error('Error obteniendo leaderboard:', error);
      return [];
    }
  }

  /**
   * Métodos privados
   */

  _getDefaultProfile(userId) {
    return {
      userId,
      totalXP: 0,
      level: 1,
      virtualMoney: 0,
      badges: [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      achievements: []
    };
  }

  _calculateLevel(totalXP) {
    let level = 1;
    for (const lvl of LEVELS) {
      if (totalXP >= lvl.minXP) {
        level = lvl.level;
      } else {
        break;
      }
    }
    return level;
  }
}

export default new GamificationFirestoreService();
