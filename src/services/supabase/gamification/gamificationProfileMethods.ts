import { STARTING_COINS_BALANCE } from '@/shared/constants/gamification';
import type { GamificationProfile } from './gamificationTypes';
import { ensureSupabase, GAMIFICATION_TABLE, mapFromDb } from './gamificationMappers';

const FULL_COLUMNS = '*';

const ECONOMY_COLUMNS =
  'user_id, xp, total_coins, spent_coins, double_xp_expires_at, league_rank, league_group_id, weekly_xp, weekly_xp_week, streak_dates, longest_streak, streak_shield_count' as const;

const ACHIEVEMENTS_META_COLUMNS = 'user_id, achievements' as const;

const STREAK_COLUMNS = 'user_id, streak_dates, longest_streak' as const;

export type GamificationAchievementsMeta = {
  userId: string;
  achievements: unknown;
};

export async function getByUserId(userId: string): Promise<GamificationProfile | null> {
  const sb = ensureSupabase();
  const { data, error } = await sb.from(GAMIFICATION_TABLE).select(FULL_COLUMNS).eq('user_id', userId).maybeSingle();
  if (error) throw new Error(`Error leyendo gamificación: ${error.message}`);
  return data ? mapFromDb(data as Record<string, unknown>) : null;
}

export async function getAchievementsMetaByUserId(userId: string): Promise<GamificationAchievementsMeta | null> {
  const sb = ensureSupabase();
  const { data, error } = await sb
    .from(GAMIFICATION_TABLE)
    .select(ACHIEVEMENTS_META_COLUMNS)
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw new Error(`Error leyendo logros: ${error.message}`);
  if (!data) return null;
  const row = data as Record<string, unknown>;
  return {
    userId: String(row.user_id ?? userId),
    achievements: row.achievements ?? {},
  };
}

export async function getEconomyByUserId(userId: string): Promise<GamificationProfile | null> {
  const sb = ensureSupabase();
  const { data, error } = await sb.from(GAMIFICATION_TABLE).select(ECONOMY_COLUMNS).eq('user_id', userId).maybeSingle();
  if (error) throw new Error(`Error leyendo economía: ${error.message}`);
  return data ? mapFromDb(data as Record<string, unknown>) : null;
}

export async function getStreakByUserId(
  userId: string
): Promise<Pick<GamificationProfile, 'userId' | 'streakDates' | 'longestStreak'> | null> {
  const sb = ensureSupabase();
  const { data, error } = await sb.from(GAMIFICATION_TABLE).select(STREAK_COLUMNS).eq('user_id', userId).maybeSingle();
  if (error) throw new Error(`Error leyendo racha: ${error.message}`);
  if (!data) return null;
  const row = data as Record<string, unknown>;
  return {
    userId: String(row.user_id ?? userId),
    streakDates: Array.isArray(row.streak_dates) ? (row.streak_dates as string[]) : [],
    longestStreak: Number(row.longest_streak ?? 0),
  };
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
