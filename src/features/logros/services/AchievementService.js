import { doc, collection, setDoc, getDoc, updateDoc, getDocs, addDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';

/**
 * Servicio para manejar logros en Firestore
 * Maneja: Desblocar, obtener, actualizar logros del usuario
 */
class AchievementService {
  /**
   * Obtiene todos los logros disponibles
   * @returns {Promise<Array>}
   */
  async getAllAchievements() {
    try {
      const achievementsRef = collection(db, 'achievements');
      const snapshot = await getDocs(achievementsRef);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error al obtener logros:', error);
      throw error;
    }
  }

  /**
   * Obtiene un logro específico
   * @param {string} achievementId - ID del logro
   * @returns {Promise<Object|null>}
   */
  async getAchievement(achievementId) {
    try {
      const achievementRef = doc(db, 'achievements', achievementId);
      const achievementDoc = await getDoc(achievementRef);
      
      if (achievementDoc.exists()) {
        return { id: achievementDoc.id, ...achievementDoc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error al obtener logro:', error);
      throw error;
    }
  }

  /**
   * Desbloquea un logro para el usuario
   * @param {string} userId - ID del usuario
   * @param {string} achievementId - ID del logro
   * @param {Object} metadata - Información adicional del desbloqueo
   * @returns {Promise<void>}
   */
  async unlockAchievement(userId, achievementId, metadata = {}) {
    try {
      const userAchievementsRef = doc(db, 'userAchievements', userId);
      
      const unlockedAchievement = {
        achievementId,
        unlockedAt: Timestamp.now(),
        ...metadata
      };

      await updateDoc(userAchievementsRef, {
        achievements: arrayUnion(unlockedAchievement)
      }).catch(async () => {
        // Si el documento no existe, lo creamos
        await setDoc(userAchievementsRef, {
          userId,
          achievements: [unlockedAchievement],
          updatedAt: Timestamp.now()
        });
      });
    } catch (error) {
      console.error('Error al desbloquear logro:', error);
      throw error;
    }
  }

  /**
   * Obtiene los logros desbloqueados del usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<Array>}
   */
  async getUserAchievements(userId) {
    try {
      const userAchievementsRef = doc(db, 'userAchievements', userId);
      const doc_ref = await getDoc(userAchievementsRef);
      
      if (doc_ref.exists()) {
        return doc_ref.data().achievements || [];
      }
      return [];
    } catch (error) {
      console.error('Error al obtener logros del usuario:', error);
      throw error;
    }
  }

  /**
   * Verifica si un usuario ha desbloqueado un logro
   * @param {string} userId - ID del usuario
   * @param {string} achievementId - ID del logro
   * @returns {Promise<boolean>}
   */
  async hasAchievement(userId, achievementId) {
    try {
      const achievements = await this.getUserAchievements(userId);
      return achievements.some(a => a.achievementId === achievementId);
    } catch (error) {
      console.error('Error al verificar logro:', error);
      return false;
    }
  }

  /**
   * Crea un nuevo logro (para administradores)
   * @param {Object} achievementData - Datos del logro
   * @returns {Promise<string>} - ID del logro creado
   */
  async createAchievement(achievementData) {
    try {
      const achievementsRef = collection(db, 'achievements');
      const docRef = await addDoc(achievementsRef, {
        ...achievementData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error al crear logro:', error);
      throw error;
    }
  }

  /**
   * Obtiene las estadísticas de logros del usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>}
   */
  async getAchievementStats(userId) {
    try {
      const userAchievements = await this.getUserAchievements(userId);
      const allAchievements = await this.getAllAchievements();
      
      return {
        totalAchievements: allAchievements.length,
        unlockedAchievements: userAchievements.length,
        progress: (userAchievements.length / allAchievements.length) * 100 || 0,
        lastUnlockedAt: userAchievements[userAchievements.length - 1]?.unlockedAt || null
      };
    } catch (error) {
      console.error('Error al obtener estadísticas de logros:', error);
      throw error;
    }
  }
}

export default new AchievementService();
