/**
 * Gamificación — recompensas vía API (service role) o lectura directa de perfil.
 */
import GamificationSupabaseService from '@/services/supabase/GamificationSupabaseService';
import {
  awardCoinsViaApi,
  awardXpViaApi,
  spendCoinsViaApi,
} from '@/services/gamification/gamificationAwardClient';

export const gamificationPersistence = {
  addXP: async (userId: string, points: number, reason = 'activity') => {
    await awardXpViaApi(userId, points, reason);
    return GamificationSupabaseService.getOrCreate(userId);
  },

  addCoins: async (userId: string, amount: number, reason = 'reward') => {
    await awardCoinsViaApi(userId, amount, reason);
    return GamificationSupabaseService.getOrCreate(userId);
  },

  spendCoins: async (userId: string, amount: number, item = 'purchase') => {
    await spendCoinsViaApi(userId, amount, item);
    return GamificationSupabaseService.getOrCreate(userId);
  },

  getProfile: (userId: string) => GamificationSupabaseService.getOrCreate(userId),
};

export default gamificationPersistence;
