import { db } from '@/config/firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  Timestamp
} from 'firebase/firestore';

/**
 * Servicio de Firestore para gestionar usuarios
 */
class UserFirestoreService {
  constructor() {
    this.collectionName = 'users';
  }

  /**
   * Crear perfil de usuario nuevo
   */
  async createUserProfile(userId, userData) {
    try {
      const userRef = doc(db, this.collectionName, userId);
      
      const defaultProfile = {
        uid: userId,
        email: userData.email,
        displayName: userData.displayName || 'Usuario ICFES',
        photoURL: userData.photoURL || null,
        bio: '',
        virtualMoney: 1000,
        totalXP: 0,
        level: 1,
        badges: [],
        googleImageSynced: !!userData.photoURL, // Flag para controlar sincronización de imagen de Google
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        // Configuración
        preferences: {
          theme: 'dark',
          notifications: true,
          soundEnabled: false,
          language: 'es',
          privacyLevel: 'private'
        },
        // Estadísticas
        stats: {
          totalExamsCompleted: 0,
          totalPracticeCompleted: 0,
          averageScore: 0,
          streakDays: 0,
          lastActivityDate: null
        }
      };

      await setDoc(userRef, defaultProfile);
      return defaultProfile;
    } catch (error) {
      console.error('Error creando perfil de usuario:', error);
      throw error;
    }
  }

  /**
   * Obtener perfil del usuario
   */
  async getUserProfile(userId) {
    try {
      const userRef = doc(db, this.collectionName, userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error('Perfil de usuario no encontrado');
      }

      return userSnap.data();
    } catch (error) {
      console.error('Error obteniendo perfil de usuario:', error);
      throw error;
    }
  }

  /**
   * Actualizar perfil del usuario
   */
  async updateUserProfile(userId, updates) {
    try {
      const userRef = doc(db, this.collectionName, userId);
      
      const updateData = {
        ...updates,
        updatedAt: Timestamp.now()
      };

      await updateDoc(userRef, updateData);
      
      // Retornar los datos actualizados
      return this.getUserProfile(userId);
    } catch (error) {
      console.error('Error actualizando perfil de usuario:', error);
      throw error;
    }
  }

  /**
   * Actualizar nombre de usuario
   */
  async updateUsername(userId, username) {
    if (!username || username.trim().length === 0) {
      throw new Error('El nombre de usuario no puede estar vacío');
    }
    if (username.length > 30) {
      throw new Error('El nombre de usuario no puede exceder 30 caracteres');
    }

    return this.updateUserProfile(userId, {
      displayName: username.trim()
    });
  }

  /**
   * Actualizar biografía
   */
  async updateUserBio(userId, bio) {
    if (bio && bio.length > 150) {
      throw new Error('La biografía no puede exceder 150 caracteres');
    }

    return this.updateUserProfile(userId, {
      bio: bio?.trim() || ''
    });
  }

  /**
   * Actualizar foto de perfil
   */
  async updateProfileImage(userId, photoURL) {
    return this.updateUserProfile(userId, {
      photoURL: photoURL || null
    });
  }

  /**
   * Obtener preferencias del usuario
   */
  async getUserPreferences(userId) {
    try {
      const profile = await this.getUserProfile(userId);
      return profile.preferences || {};
    } catch (error) {
      console.error('Error obteniendo preferencias:', error);
      return {};
    }
  }

  /**
   * Actualizar preferencias del usuario
   */
  async updateUserPreferences(userId, preferences) {
    try {
      const userRef = doc(db, this.collectionName, userId);
      const currentProfile = await this.getUserProfile(userId);
      
      const updatedPreferences = {
        ...currentProfile.preferences,
        ...preferences
      };

      await updateDoc(userRef, {
        preferences: updatedPreferences,
        updatedAt: Timestamp.now()
      });

      return updatedPreferences;
    } catch (error) {
      console.error('Error actualizando preferencias:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas del usuario
   */
  async getUserStats(userId) {
    try {
      const profile = await this.getUserProfile(userId);
      return profile.stats || {};
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return {};
    }
  }

  /**
   * Actualizar estadísticas del usuario
   */
  async updateUserStats(userId, stats) {
    try {
      const userRef = doc(db, this.collectionName, userId);
      const currentProfile = await this.getUserProfile(userId);
      
      const updatedStats = {
        ...currentProfile.stats,
        ...stats,
        lastActivityDate: Timestamp.now()
      };

      await updateDoc(userRef, {
        stats: updatedStats,
        updatedAt: Timestamp.now()
      });

      return updatedStats;
    } catch (error) {
      console.error('Error actualizando estadísticas:', error);
      throw error;
    }
  }

  /**
   * Agregar monedas virtuales
   */
  async addVirtualMoney(userId, amount, reason = 'bonus') {
    try {
      const profile = await this.getUserProfile(userId);
      const newAmount = profile.virtualMoney + amount;

      return this.updateUserProfile(userId, {
        virtualMoney: newAmount
      });
    } catch (error) {
      console.error('Error agregando monedas:', error);
      throw error;
    }
  }

  /**
   * Gastar monedas virtuales
   */
  async spendVirtualMoney(userId, amount, reason = 'purchase') {
    try {
      const profile = await this.getUserProfile(userId);
      
      if (profile.virtualMoney < amount) {
        throw new Error('Monedas insuficientes');
      }

      const newAmount = profile.virtualMoney - amount;

      return this.updateUserProfile(userId, {
        virtualMoney: newAmount
      });
    } catch (error) {
      console.error('Error gastando monedas:', error);
      throw error;
    }
  }

  /**
   * Obtener lista de usuarios (para leaderboard)
   */
  async getLeaderboard(limit = 10) {
    try {
      const usersRef = collection(db, this.collectionName);
      const q = query(usersRef);
      const querySnapshot = await getDocs(q);

      const users = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        users.push({
          id: doc.id,
          displayName: userData.displayName,
          totalXP: userData.totalXP || 0,
          level: userData.level || 1,
          photoURL: userData.photoURL
        });
      });

      // Ordenar por XP descendente y retornar top N
      return users
        .sort((a, b) => b.totalXP - a.totalXP)
        .slice(0, limit);
    } catch (error) {
      console.error('Error obteniendo leaderboard:', error);
      return [];
    }
  }

  /**
   * Agregar badge al usuario
   */
  async addBadge(userId, badgeId) {
    try {
      const profile = await this.getUserProfile(userId);
      const badges = profile.badges || [];

      if (!badges.includes(badgeId)) {
        badges.push(badgeId);
        return this.updateUserProfile(userId, {
          badges: badges
        });
      }

      return profile;
    } catch (error) {
      console.error('Error agregando badge:', error);
      throw error;
    }
  }

  /**
   * Eliminar cuenta de usuario (y todos sus datos asociados)
   */
  async deleteUserAccount(userId) {
    try {
      const batch = writeBatch(db);

      // Eliminar documento del usuario
      const userRef = doc(db, this.collectionName, userId);
      batch.delete(userRef);

      // Eliminar documentos de progreso
      const progressRef = collection(db, `users/${userId}/progress`);
      const progressSnap = await getDocs(progressRef);
      progressSnap.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Eliminar documentos de exámenes
      const examsRef = collection(db, `users/${userId}/exams`);
      const examsSnap = await getDocs(examsRef);
      examsSnap.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Eliminar documentos de gamificación
      const gamificationRef = collection(db, `users/${userId}/gamification`);
      const gamificationSnap = await getDocs(gamificationRef);
      gamificationSnap.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      return true;
    } catch (error) {
      console.error('Error eliminando cuenta de usuario:', error);
      throw error;
    }
  }

  /**
   * Verificar si el usuario existe
   */
  async userExists(userId) {
    try {
      const userRef = doc(db, this.collectionName, userId);
      const userSnap = await getDoc(userRef);
      return userSnap.exists();
    } catch (error) {
      console.error('Error verificando existencia de usuario:', error);
      return false;
    }
  }

  /**
   * Verificar si un email existe en la base de datos
   */
  async userExistsByEmail(email) {
    try {
      const usersRef = collection(db, this.collectionName);
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      return querySnapshot.size > 0;
    } catch (error) {
      console.error('Error verificando email:', error);
      return false;
    }
  }

  /**
   * Obtener datos completos del usuario
   */
  async getCompleteUserData(userId) {
    try {
      const profile = await this.getUserProfile(userId);
      return {
        profile,
        joinedDate: profile.createdAt?.toDate?.() || new Date(),
        preferences: profile.preferences || {},
        stats: profile.stats || {}
      };
    } catch (error) {
      console.error('Error obteniendo datos completos del usuario:', error);
      throw error;
    }
  }
  /**
   * Obtener perfil público de un usuario
   * @param {string} userId 
   * @returns {Promise<Object|null>}
   */
  async getPublicProfile(userId) {
    try {
      const userRef = doc(db, this.collectionName, userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error al obtener perfil público:', error);
      throw error;
    }
  }
}

export default new UserFirestoreService();
