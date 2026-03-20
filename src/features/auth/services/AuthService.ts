/**
 * Servicio de autenticación - Versión local
 * Preparado para futura implementación de backend
 */
class AuthService {
  async verifyResetCode(code) {
    return true;
  }

  async confirmReset(oobCode, password) {
    return true;
  }
}

export default new AuthService();
