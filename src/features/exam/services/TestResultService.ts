/**
 * Servicio de resultados de exámenes - Versión local
 * Preparado para futura implementación de backend
 */
class TestResultService {
  async saveResult(_userId: string, _resultData: Record<string, unknown>) {}
  async getResults(_userId: string) {
    return [];
  }
}

export default new TestResultService();
