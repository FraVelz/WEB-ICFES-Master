/** Auth helpers — local stub (extend when backend exists) */
class AuthService {
  async verifyResetCode(_code: string): Promise<boolean> {
    return true;
  }

  async confirmReset(_oobCode: string, _password: string): Promise<boolean> {
    return true;
  }
}

export default new AuthService();
