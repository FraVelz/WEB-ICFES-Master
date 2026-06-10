/**
 * Gamificación — Supabase (`user_gamification`).
 */
import GamificationSupabaseService from '@/services/supabase/GamificationSupabaseService';

export const gamificationPersistence = {
  addXP: (userId: string, points: number, reason?: string) => GamificationSupabaseService.addXP(userId, points, reason),

  addCoins: (userId: string, amount: number, reason?: string) =>
    GamificationSupabaseService.addCoins(userId, amount, reason),

  spendCoins: (userId: string, amount: number, item?: string) =>
    GamificationSupabaseService.spendCoins(userId, amount, item),

  getProfile: (userId: string) => GamificationSupabaseService.getOrCreate(userId),
};

export default gamificationPersistence;
