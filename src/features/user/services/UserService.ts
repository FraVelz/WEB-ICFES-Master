/**
 * USER SERVICE - Gestión de datos de usuario
 * Maneja: perfil, configuración, preferencias, autenticación
 */

import BaseService from '@/services/BaseService';

class UserService extends BaseService {
  constructor() {
    super('user');
  }

  /**
   * Obtener perfil completo del usuario actual
   * @returns {Promise<Object>}
   */
  async getUserProfile() {
    try {
      const user = await this.get();
      return Array.isArray(user) ? user[0] : user;
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      throw error;
    }
  }

  /**
   * Actualizar perfil del usuario
   * @param {string} userId
   * @param {Object} profileData
   * @returns {Promise<Object>}
   */
  async updateProfile(userId, profileData) {
    return this.update(userId, {
      ...profileData,
      lastProfileUpdate: new Date().toISOString(),
    });
  }

  /**
   * Obtener configuración del usuario
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getSettings(userId) {
    const user = await this.get(userId);
    return user?.settings || {};
  }

  /**
   * Actualizar configuración del usuario
   * @param {string} userId
   * @param {Object} settings
   * @returns {Promise<Object>}
   */
  async updateSettings(userId, settings) {
    const user = await this.get(userId);
    return this.update(userId, {
      ...user,
      settings: {
        ...user?.settings,
        ...settings,
      },
    });
  }

  /**
   * Cambiar foto de perfil
   * @param {string} userId
   * @param {string} imageBase64
   * @returns {Promise<Object>}
   */
  async updateProfileImage(userId, imageBase64) {
    return this.update(userId, {
      profileImage: imageBase64,
      lastImageUpdate: new Date().toISOString(),
    });
  }

  /**
   * Actualizar nombre de usuario
   * @param {string} userId
   * @param {string} username
   * @returns {Promise<Object>}
   */
  async updateUsername(userId, username) {
    return this.update(userId, { username });
  }

  /**
   * Actualizar frase personal
   * @param {string} userId
   * @param {string} phrase
   * @returns {Promise<Object>}
   */
  async updatePersonalPhrase(userId, phrase) {
    return this.update(userId, { personalPhrase: phrase });
  }

  /**
   * Exportar todos los datos del usuario (para respaldo)
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async exportUserData(userId) {
    // Este método se completaría con datos de otros servicios
    // Por ahora retorna datos del usuario
    return this.get(userId);
  }

  /**
   * Importar datos de usuario desde respaldo
   * @param {string} userId
   * @param {Object} backupData
   * @returns {Promise<Object>}
   */
  async importUserData(userId, backupData) {
    return this.update(userId, {
      ...backupData,
      lastImport: new Date().toISOString(),
    });
  }

  /**
   * Eliminar cuenta de usuario (hard delete)
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async deleteAccount(userId) {
    return this.delete(userId);
  }

  /**
   * Inicializar usuario nuevo
   * @param {Object} userData
   * @returns {Promise<Object>}
   */
  async initializeUser(userData = {}) {
    return this.create({
      username: userData.username || 'Usuario ICFES',
      email: userData.email || null,
      profileImage: userData.profileImage || null,
      personalPhrase:
        userData.personalPhrase || 'Preparándome para ser el mejor',
      points: 0,
      level: 0,
      streak: 0,
      settings: {
        notifications: true,
        soundEnabled: true,
        darkMode: true,
        ...userData.settings,
      },
      stats: {
        totalExams: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        ...userData.stats,
      },
      ...userData,
    });
  }
}

export default new UserService();
