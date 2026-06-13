/**
 * Gamificación — gasto de monedas vía API (service role) o lectura directa de perfil.
 */
import GamificationSupabaseService from '@/services/supabase/GamificationSupabaseService';
import { spendCoinsViaApi } from '@/services/gamification/gamificationAwardClient';

export const gamificationPersistence = {
  spendCoins: async (userId: string, amount: number, item = 'purchase') => {
    await spendCoinsViaApi(userId, amount, item);
    return GamificationSupabaseService.getOrCreate(userId);
  },

  getProfile: (userId: string) => GamificationSupabaseService.getOrCreate(userId),
};

export default gamificationPersistence;
