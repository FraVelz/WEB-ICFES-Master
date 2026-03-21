/**
 * Adaptador de gamificación - usa Supabase o localStorage según API_CONFIG
 */
import API_CONFIG from '@/services/api.config';
import GamificationSupabaseService from '@/services/supabase/GamificationSupabaseService';
import GamificationLocalService from '@/features/logros/services/GamificationLocalService';

const getService = () =>
  API_CONFIG.MODE === 'supabase'
    ? GamificationSupabaseService
    : GamificationLocalService;

const service = () => getService();

export default {
  addXP: (userId: string, points: number, reason?: string) => service().addXP(userId, points, reason),
  addCoins: (userId: string, amount: number, reason?: string) =>
    service().addCoins(userId, amount, reason),
  spendCoins: (userId: string, amount: number, item?: string) =>
    service().spendCoins(userId, amount, item),
  getProfile: async (userId: string) => {
    const s = service();
    if ('getProfile' in s && typeof s.getProfile === 'function') {
      return s.getProfile(userId);
    }
    if ('getOrCreate' in s && typeof s.getOrCreate === 'function') {
      return s.getOrCreate(userId);
    }
    throw new Error('Gamification service has no getProfile or getOrCreate');
  },
};
