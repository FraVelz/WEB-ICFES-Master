/**
 * GamificationSupabaseService - Gestión de gamificación en Supabase
 */
import { supabase } from '@/config/supabase';

const TABLE = 'user_gamification';

const mapFromDb = (row) => {
  if (!row) return null;
  return {
    userId: row.user_id,
    xp: row.xp ?? row.total_xp ?? 0,
    level: row.level ?? 1,
    totalXP: Number(row.total_xp ?? row.xp ?? 0),
    currentXP: Number(row.current_xp ?? row.xp ?? 0),
    totalCoins: Number(row.total_coins ?? 0),
    spentCoins: Number(row.spent_coins ?? 0),
    badges: row.badges || [],
    achievements: row.achievements || [],
    xpHistory: row.xp_history || [],
    coinsHistory: row.coins_history || [],
    updatedAt: row.updated_at,
  };
};

const GamificationSupabaseService = {
  async getByUserId(userId) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw new Error(`Error leyendo gamificación: ${error.message}`);
    return data ? mapFromDb(data) : null;
  },

  async getOrCreate(userId) {
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
      const { data, error } = await supabase
        .from(TABLE)
        .upsert(payload, { onConflict: 'user_id' })
        .select()
        .single();
      if (error)
        throw new Error(`Error creando gamificación: ${error.message}`);
      profile = mapFromDb(data);
    }
    return profile;
  },

  async addXP(userId, points, reason = 'activity') {
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
    const { data, error } = await supabase
      .from(TABLE)
      .upsert(payload, { onConflict: 'user_id' })
      .select()
      .single();
    if (error) throw new Error(`Error añadiendo XP: ${error.message}`);
    return mapFromDb(data);
  },

  async addCoins(userId, amount, reason = 'reward') {
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
    const { data, error } = await supabase
      .from(TABLE)
      .upsert(payload, { onConflict: 'user_id' })
      .select()
      .single();
    if (error) throw new Error(`Error añadiendo monedas: ${error.message}`);
    return mapFromDb(data);
  },

  async spendCoins(userId, amount, item = 'purchase') {
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
    const { data, error } = await supabase
      .from(TABLE)
      .update(payload)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw new Error(`Error gastando monedas: ${error.message}`);
    return mapFromDb(data);
  },

  _calculateLevel(totalXP) {
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
