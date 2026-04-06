/**
 * Gamificación: una sola entrada para Supabase o localStorage.
 */
import GamificationSupabaseService from '@/services/supabase/GamificationSupabaseService';
import GamificationLocalService from '@/features/logros/services/GamificationLocalService';
import { isSupabaseMode } from './apiMode';

const impl = () => (isSupabaseMode() ? GamificationSupabaseService : GamificationLocalService);

export const gamificationPersistence = {
  addXP: (userId: string, points: number, reason?: string) => impl().addXP(userId, points, reason),

  addCoins: (userId: string, amount: number, reason?: string) => impl().addCoins(userId, amount, reason),

  spendCoins: (userId: string, amount: number, item?: string) => impl().spendCoins(userId, amount, item),

  getProfile: async (userId: string) => {
    const s = impl();
    if ('getProfile' in s && typeof s.getProfile === 'function') {
      return s.getProfile(userId);
    }
    if ('getOrCreate' in s && typeof s.getOrCreate === 'function') {
      return s.getOrCreate(userId);
    }
    throw new Error('Servicio de gamificación sin getProfile ni getOrCreate');
  },
};

export default gamificationPersistence;
