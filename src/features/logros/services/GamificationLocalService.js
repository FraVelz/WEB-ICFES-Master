/**
 * Servicio de gamificación - Versión local (localStorage)
 */
import {
  addVirtualMoney,
  removeVirtualMoney,
  getVirtualMoney,
} from '@/shared/utils/userProfile';
import { calculateLevel } from '../utils/gamificationUtils';

const GAMIFICATION_KEY = 'icfes_gamification';

class GamificationLocalService {
  async createGamificationProfile(userId) {
    const defaultProfile = {
      userId,
      totalXP: 0,
      level: 1,
      virtualMoney: 0,
      achievements: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(GAMIFICATION_KEY, JSON.stringify(defaultProfile));
    return defaultProfile;
  }

  async getProfile(userId) {
    const stored = localStorage.getItem(GAMIFICATION_KEY);
    return stored
      ? JSON.parse(stored)
      : { totalXP: 0, level: 1, virtualMoney: 0, achievements: {} };
  }

  async addXP(userId, points, reason = 'activity') {
    const gam = JSON.parse(localStorage.getItem(GAMIFICATION_KEY) || '{}');
    const newXP = (gam.totalXP || 0) + points;
    const newLevel = calculateLevel(newXP);
    const updated = {
      ...gam,
      totalXP: newXP,
      level: newLevel,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(GAMIFICATION_KEY, JSON.stringify(updated));
    return { totalXP: newXP, level: newLevel };
  }

  async addCoins(userId, amount, reason = 'reward') {
    addVirtualMoney(amount);
    return { coins: getVirtualMoney(), virtualMoney: getVirtualMoney() };
  }

  async spendCoins(userId, amount, item = 'purchase') {
    removeVirtualMoney(amount);
    return { coins: getVirtualMoney(), virtualMoney: getVirtualMoney() };
  }
}

export default new GamificationLocalService();
