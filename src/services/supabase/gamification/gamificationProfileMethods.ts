import { STARTING_COINS_BALANCE } from '@/shared/constants/gamification';
import type { GamificationProfile } from './gamificationTypes';
import { ensureSupabase, GAMIFICATION_TABLE, mapFromDb } from './gamificationMappers';

export async function getByUserId(userId: string): Promise<GamificationProfile | null> {
  const sb = ensureSupabase();
  const { data, error } = await sb.from(GAMIFICATION_TABLE).select('*').eq('user_id', userId).maybeSingle();
  if (error) throw new Error(`Error leyendo gamificación: ${error.message}`);
  return data ? mapFromDb(data as Record<string, unknown>) : null;
}

export async function getOrCreate(userId: string): Promise<GamificationProfile> {
  let profile = await getByUserId(userId);
  if (!profile) {
    const payload = {
      user_id: userId,
      xp: 0,
      total_coins: STARTING_COINS_BALANCE,
      spent_coins: 0,
      achievements: [],
      xp_history: [],
      coins_history: [],
      streak_dates: [],
      longest_streak: 0,
      shop_inventory: [],
      equipped_logo_id: null,
      double_xp_expires_at: null,
      personal_logos: [],
      streak_shield_count: 0,
      updated_at: new Date().toISOString(),
    };
    const sb = ensureSupabase();
    const { data, error } = await sb
      .from(GAMIFICATION_TABLE)
      .upsert(payload, { onConflict: 'user_id' })
      .select()
      .single();
    if (error) throw new Error(`Error creando gamificación: ${error.message}`);
    profile = mapFromDb(data as Record<string, unknown>)!;
  }

  if (profile && !profile.leagueGroupId) {
    const sb = ensureSupabase();
    const { error: assignError } = await sb.rpc('assign_league_group', {
      p_user_id: userId,
      p_league_rank: profile.leagueRank || 'novato',
    });
    if (assignError) {
      console.warn('No se pudo asignar grupo de liga:', assignError.message);
    } else {
      profile = (await getByUserId(userId)) ?? profile;
    }
  }

  return profile;
}
