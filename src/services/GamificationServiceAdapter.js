/**
 * Adaptador de gamificación - usa Supabase o localStorage según API_CONFIG
 */
import API_CONFIG from '@/services/api.config';
import GamificationSupabaseService from '@/services/supabase/GamificationSupabaseService';
import GamificationLocalService from '@/features/logros/services/GamificationLocalService';

const getService = () =>
  API_CONFIG.MODE === 'supabase' ? GamificationSupabaseService : GamificationLocalService;

export default {
  addXP: (userId, points, reason) => getService().addXP(userId, points, reason),
  addCoins: (userId, amount, reason) => getService().addCoins(userId, amount, reason),
  spendCoins: (userId, amount, item) => getService().spendCoins(userId, amount, item),
  getProfile: (userId) => getService().getProfile?.(userId) ?? getService().getOrCreate?.(userId)
};
