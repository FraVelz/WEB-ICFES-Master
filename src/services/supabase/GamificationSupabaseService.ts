/**
 * GamificationSupabaseService - Gestión de gamificación en Supabase
 */
import { supabase } from '@/config/supabase';

const TABLE = 'user_gamification';

export interface GamificationProfile {
  userId: string;
  xp: number;
  totalCoins: number;
  spentCoins: number;
  achievements: unknown[];
  xpHistory: unknown[];
  coinsHistory: unknown[];
  streakDates: string[];
  longestStreak: number;
  updatedAt: unknown;
}

const mapFromDb = (row: Record<string, unknown> | null): GamificationProfile | null => {
  if (!row || typeof row !== 'object') return null;
  return {
    userId: String(row.user_id ?? ''),
    xp: Number(row.xp ?? 0),
    totalCoins: Number(row.total_coins ?? 0),
    spentCoins: Number(row.spent_coins ?? 0),
    achievements: (row.achievements as unknown[]) || [],
    xpHistory: (row.xp_history as unknown[]) || [],
    coinsHistory: (row.coins_history as unknown[]) || [],
    streakDates: Array.isArray(row.streak_dates) ? (row.streak_dates as string[]) : [],
    longestStreak: Number(row.longest_streak ?? 0),
    updatedAt: row.updated_at,
  };
};

function ensureSupabase() {
  if (!supabase) throw new Error('Supabase no configurado');
  return supabase;
}

const GamificationSupabaseService = {
  async getByUserId(userId: string): Promise<GamificationProfile | null> {
    const sb = ensureSupabase();
    const { data, error } = await sb.from(TABLE).select('*').eq('user_id', userId).maybeSingle();
    if (error) throw new Error(`Error leyendo gamificación: ${error.message}`);
    return data ? mapFromDb(data as Record<string, unknown>) : null;
  },

  async getOrCreate(userId: string): Promise<GamificationProfile> {
    let profile = await this.getByUserId(userId);
    if (!profile) {
      const payload = {
        user_id: userId,
        xp: 0,
        total_coins: 0,
        spent_coins: 0,
        achievements: [],
        xp_history: [],
        coins_history: [],
        streak_dates: [],
        longest_streak: 0,
        updated_at: new Date().toISOString(),
      };
      const sb = ensureSupabase();
      const { data, error } = await sb.from(TABLE).upsert(payload, { onConflict: 'user_id' }).select().single();
      if (error) throw new Error(`Error creando gamificación: ${error.message}`);
      profile = mapFromDb(data as Record<string, unknown>)!;
    }
    return profile;
  },

  async addXP(userId: string, points: number, reason = 'activity'): Promise<GamificationProfile> {
    const profile = await this.getOrCreate(userId);
    const newXP = (profile.xp || 0) + points;
    const xpHistory = [...(profile.xpHistory || []), { date: new Date().toISOString(), points, reason }];

    const payload = {
      user_id: userId,
      xp: newXP,
      xp_history: xpHistory,
      updated_at: new Date().toISOString(),
    };
    const sb = ensureSupabase();
    const { data, error } = await sb.from(TABLE).upsert(payload, { onConflict: 'user_id' }).select().single();
    if (error) throw new Error(`Error añadiendo XP: ${error.message}`);
    return mapFromDb(data as Record<string, unknown>)!;
  },

  async addCoins(userId: string, amount: number, reason = 'reward'): Promise<GamificationProfile> {
    const profile = await this.getOrCreate(userId);
    const newTotalCoins = (profile.totalCoins || 0) + amount;
    const coinsHistory = [
      ...(profile.coinsHistory || []),
      { date: new Date().toISOString(), amount, reason, type: 'earn' },
    ];

    const payload = {
      user_id: userId,
      total_coins: newTotalCoins,
      coins_history: coinsHistory,
      updated_at: new Date().toISOString(),
    };
    const sb = ensureSupabase();
    const { data, error } = await sb.from(TABLE).upsert(payload, { onConflict: 'user_id' }).select().single();
    if (error) throw new Error(`Error añadiendo monedas: ${error.message}`);
    return mapFromDb(data as Record<string, unknown>)!;
  },

  async spendCoins(userId: string, amount: number, item = 'purchase'): Promise<GamificationProfile> {
    const profile = await this.getOrCreate(userId);
    const available = (profile.totalCoins || 0) - (profile.spentCoins || 0);
    if (available < amount) throw new Error('Monedas insuficientes');
    const newSpent = (profile.spentCoins || 0) + amount;
    const coinsHistory = [
      ...(profile.coinsHistory || []),
      { date: new Date().toISOString(), amount, item, type: 'spend' },
    ];

    const payload = {
      user_id: userId,
      spent_coins: newSpent,
      coins_history: coinsHistory,
      updated_at: new Date().toISOString(),
    };
    const sb = ensureSupabase();
    const { data, error } = await sb.from(TABLE).update(payload).eq('user_id', userId).select().single();
    if (error) throw new Error(`Error gastando monedas: ${error.message}`);
    return mapFromDb(data as Record<string, unknown>)!;
  },

  async getStreak(userId: string): Promise<{ dates: string[]; longestStreak: number }> {
    const profile = await this.getOrCreate(userId);
    return {
      dates: profile.streakDates ?? [],
      longestStreak: profile.longestStreak ?? 0,
    };
  },

  async updateStreak(userId: string, state: { dates: string[]; longestStreak: number }): Promise<GamificationProfile> {
    await this.getOrCreate(userId);
    const sb = ensureSupabase();
    const payload = {
      user_id: userId,
      streak_dates: state.dates,
      longest_streak: state.longestStreak,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await sb.from(TABLE).upsert(payload, { onConflict: 'user_id' }).select().single();
    if (error) throw new Error(`Error guardando racha: ${error.message}`);
    return mapFromDb(data as Record<string, unknown>)!;
  },

  async updateAchievements(userId: string, achievements: Record<string, unknown>): Promise<GamificationProfile> {
    await this.getOrCreate(userId);
    const sb = ensureSupabase();
    const { data, error } = await sb
      .from(TABLE)
      .update({ achievements, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw new Error(`Error actualizando logros: ${error.message}`);
    return mapFromDb(data as Record<string, unknown>)!;
  },
};

export default GamificationSupabaseService;
