/**
 * Agregado de perfil + progreso + gamificación (p. ej. exportar datos del usuario).
 */
import UserSupabaseService from '@/services/supabase/UserSupabaseService';
import ProgressSupabaseService from '@/services/supabase/ProgressSupabaseService';
import GamificationSupabaseService from '@/services/supabase/GamificationSupabaseService';
import { isSupabaseMode } from './apiMode';

export async function getAggregatedUserData(uid: string): Promise<Record<string, unknown>> {
  if (!isSupabaseMode()) {
    const profile = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('icfes_user_profile') || '{}') : {};
    const progress =
      typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('icfes_progress') || 'null') : null;
    const gamification =
      typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('icfes_gamification') || '{}') : {};
    return { profile, progress, gamification };
  }

  const profile = await UserSupabaseService.getByUserId(uid);
  const [progress, gamification] = await Promise.all([
    ProgressSupabaseService.getByUserId(uid),
    GamificationSupabaseService.getByUserId(uid),
  ]);
  return { profile, progress, gamification };
}
