/**
 * Agregado de perfil + progreso + gamificación (p. ej. exportar datos del usuario).
 */
import UserSupabaseService from '@/services/supabase/UserSupabaseService';
import ProgressSupabaseService from '@/services/supabase/ProgressSupabaseService';
import GamificationSupabaseService from '@/services/supabase/GamificationSupabaseService';

export async function getAggregatedUserData(uid: string): Promise<Record<string, unknown>> {
  const profile = await UserSupabaseService.getByUserId(uid);
  const [progress, gamification] = await Promise.all([
    ProgressSupabaseService.getByUserId(uid),
    GamificationSupabaseService.getByUserId(uid),
  ]);
  return { profile, progress, gamification };
}
