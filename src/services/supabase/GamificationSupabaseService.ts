/**
 * GamificationSupabaseService - Gestión de gamificación en Supabase
 */
import { supabase } from '@/config/supabase';

const TABLE = 'user_gamification';

export interface GamificationProfile {
  userId: string;
  xp: number;
  level: number;
  totalXP: number;
  currentXP: number;
  totalCoins: number;
  spentCoins: number;
  badges: unknown[];
  achievements: unknown[];
  xpHistory: unknown[];
  coinsHistory: unknown[];
  updatedAt: unknown;
}

const mapFromDb = (row: Record<string, unknown> | null): GamificationProfile | null => {
  if (!row || typeof row !== 'object') return null;
  return {
    userId: String(row.user_id ?? ''),
    xp: Number(row.xp ?? row.total_xp ?? 0),
    level: Number(row.level ?? 1),
    totalXP: Number(row.total_xp ?? row.xp ?? 0),
    currentXP: Number(row.current_xp ?? row.xp ?? 0),
    totalCoins: Number(row.total_coins ?? 0),
    spentCoins: Number(row.spent_coins ?? 0),
    badges: (row.badges as unknown[]) || [],
    achievements: (row.achievements as unknown[]) || [],
    xpHistory: (row.xp_history as unknown[]) || [],
    coinsHistory: (row.coins_history as unknown[]) || [],
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
    const { data, error } = await sb
      .from(TABLE)
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw new Error(`Error leyendo gamificación: ${error.message}`);
    return data ? mapFromDb(data as Record<string, unknown>) : null;
  },

  async getOrCreate(userId: string): Promise<GamificationProfile> {
    let profile = await this.getByUserId(userId);
    if (!profile) {
      const payload = {
        user_id: userId,
        xp: 0,
        level: 1,
        total_coins: 0,
        spent_coins: 0,
        total_xp: 0,
        current_xp: 0,
        badges: [],
        achievements: [],
        updated_at: new Date().toISOString(),
      };
      const sb = ensureSupabase();
      const { data, error } = await sb
        .from(TABLE)
        .upsert(payload, { onConflict: 'user_id' })
        .select()
        .single();
      if (error)
        throw new Error(`Error creando gamificación: ${error.message}`);
      profile = mapFromDb(data as Record<string, unknown>)!;
    }
    return profile;
  },

  async addXP(userId: string, points: number, reason = 'activity'): Promise<GamificationProfile> {
    const profile = await this.getOrCreate(userId);
    const newTotalXP = (profile.totalXP || 0) + points;
    const newLevel = this._calculateLevel(newTotalXP);
    const xpHistory = [
      ...(profile.xpHistory || []),
      { date: new Date().toISOString(), points, reason },
    ];

    const payload = {
      user_id: userId,
      xp: newTotalXP,
      total_xp: newTotalXP,
      current_xp: newTotalXP,
      level: newLevel,
      xp_history: xpHistory,
      updated_at: new Date().toISOString(),
    };
    const sb = ensureSupabase();
    const { data, error } = await sb
      .from(TABLE)
      .upsert(payload, { onConflict: 'user_id' })
      .select()
      .single();
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
    const { data, error } = await sb
      .from(TABLE)
      .upsert(payload, { onConflict: 'user_id' })
      .select()
      .single();
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
    const { data, error } = await sb
      .from(TABLE)
      .update(payload)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw new Error(`Error gastando monedas: ${error.message}`);
    return mapFromDb(data as Record<string, unknown>)!;
  },

  _calculateLevel(totalXP: number): number {
    const levels = [
      { level: 1, xp: 0 },
      { level: 2, xp: 100 },
      { level: 3, xp: 300 },
      { level: 4, xp: 600 },
      { level: 5, xp: 1000 },
    ];
    let level = 1;
    for (const l of levels) {
      if (totalXP >= l.xp) level = l.level;
    }
    return level;
  },
};

export default GamificationSupabaseService;
