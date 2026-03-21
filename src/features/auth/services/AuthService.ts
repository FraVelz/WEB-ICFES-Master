/**
 * Servicio de autenticación - Versión local
 * Preparado para futura implementación de backend
 */
class AuthService {
  async verifyResetCode(_code: string): Promise<boolean> {
    return true;
  }

  async confirmReset(_oobCode: string, _password: string): Promise<boolean> {
    return true;
  }
}

export default new AuthService();
