/**
 * ProgressSupabaseService - Gestión de progreso en Supabase
 */
import { supabase } from '@/config/supabase';

const TABLE = 'user_progress';

const mapFromDb = (row) => {
  if (!row) return null;
  return {
    userId: row.user_id,
    totalAttempts: row.total_attempts ?? 0,
    totalCorrect: row.total_correct ?? 0,
    percentage: Number(row.percentage) ?? 0,
    streakDays: row.streak_days ?? 0,
    lastActivityDate: row.last_activity_date,
    areaStats: row.area_stats || {},
    updatedAt: row.updated_at
  };
};

const ProgressSupabaseService = {
  async getByUserId(userId) {
    const { data, error } = await supabase.from(TABLE).select('*').eq('user_id', userId).maybeSingle();
    if (error) throw new Error(`Error leyendo progreso: ${error.message}`);
    return data ? mapFromDb(data) : null;
  },

  async upsert(userId, progressData) {
    const payload = {
      user_id: userId,
      total_attempts: progressData.totalAttempts ?? progressData.total_attempts ?? 0,
      total_correct: progressData.totalCorrect ?? progressData.total_correct ?? 0,
      percentage: progressData.percentage ?? 0,
      streak_days: progressData.streakDays ?? progressData.streak_days ?? 0,
      last_activity_date: progressData.lastActivityDate ?? progressData.last_activity_date,
      area_stats: progressData.areaStats ?? progressData.area_stats ?? {},
      updated_at: new Date().toISOString()
    };
    const { data, error } = await supabase.from(TABLE).upsert(payload, { onConflict: 'user_id' }).select().single();
    if (error) throw new Error(`Error guardando progreso: ${error.message}`);
    return mapFromDb(data);
  },

  async update(userId, updates) {
    const current = await this.getByUserId(userId) || {};
    const merged = {
      totalAttempts: updates.totalAttempts ?? current.totalAttempts ?? 0,
      totalCorrect: updates.totalCorrect ?? current.totalCorrect ?? 0,
      percentage: updates.percentage ?? current.percentage ?? 0,
      streakDays: updates.streakDays ?? current.streakDays ?? 0,
      lastActivityDate: updates.lastActivityDate ?? current.lastActivityDate,
      areaStats: { ...(current.areaStats || {}), ...(updates.areaStats || {}) }
    };
    return this.upsert(userId, merged);
  }
};

export default ProgressSupabaseService;
