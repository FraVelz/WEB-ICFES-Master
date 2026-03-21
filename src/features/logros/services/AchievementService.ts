/**
 * Servicio de logros - Versión local (localStorage)
 * Preparado para futura implementación de backend
 */
import { ACHIEVEMENTS_DATA } from '../constants/achievements';

class AchievementService {
  async getAllAchievements() {
    return ACHIEVEMENTS_DATA;
  }

  async getAchievement(achievementId: string) {
    return ACHIEVEMENTS_DATA.find((a) => a.id === achievementId) || null;
  }

  async unlockAchievement(_userId: string, _achievementId: string, _metadata = {}) {
    // No-op - useGamification maneja esto con localStorage/Supabase
  }

  async getUserAchievements(_userId: string) {
    return [];
  }
}

export default new AchievementService();
