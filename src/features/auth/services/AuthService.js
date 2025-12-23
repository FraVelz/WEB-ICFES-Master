import { 
  confirmPasswordReset, 
  verifyPasswordResetCode,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '@/config/firebase';

/**
 * Servicio para manejar la autenticación con Firebase
 */
class AuthService {
  /**
   * Verifica si el código de restablecimiento de contraseña es válido
   * @param {string} code - Código de restablecimiento (oobCode)
   * @returns {Promise<string>} - Email del usuario si es válido
   */
  async verifyResetCode(code) {
    return verifyPasswordResetCode(auth, code);
  }

  /**
   * Confirma el cambio de contraseña
   * @param {string} code - Código de restablecimiento
   * @param {string} newPassword - Nueva contraseña
   * @returns {Promise<void>}
   */
  async confirmReset(code, newPassword) {
    return confirmPasswordReset(auth, code, newPassword);
  }

  /**
   * Envía correo de recuperación de contraseña
   * @param {string} email 
   * @returns {Promise<void>}
   */
  async sendPasswordResetEmail(email) {
    return sendPasswordResetEmail(auth, email);
  }

  /**
   * Inicia sesión con email y contraseña
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<UserCredential>}
   */
  async login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  /**
   * Registra un nuevo usuario
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<UserCredential>}
   */
  async register(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  /**
   * Cierra la sesión actual
   * @returns {Promise<void>}
   */
  async logout() {
    return signOut(auth);
  }

  /**
   * Inicia sesión con Google
   * @returns {Promise<UserCredential>}
   */
  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  /**
   * Actualiza el perfil del usuario actual
   * @param {User} user 
   * @param {Object} profileData 
   * @returns {Promise<void>}
   */
  async updateUserProfile(user, profileData) {
    return updateProfile(user, profileData);
  }
}

export default new AuthService();
