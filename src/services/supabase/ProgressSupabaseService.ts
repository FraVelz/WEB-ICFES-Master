/**
 * ProgressSupabaseService - Gestión de progreso en Supabase
 */
import { supabase } from '@/config/supabase';

const TABLE = 'user_progress';

export interface MappedProgress {
  userId: string;
  totalAttempts: number;
  totalCorrect: number;
  percentage: number;
  streakDays: number;
  lastActivityDate: unknown;
  areaStats: Record<string, unknown>;
  updatedAt: unknown;
}

const mapFromDb = (row: Record<string, unknown> | null): MappedProgress | null => {
  if (!row || typeof row !== 'object') return null;
  return {
    userId: String(row.user_id ?? ''),
    totalAttempts: Number(row.total_attempts ?? 0),
    totalCorrect: Number(row.total_correct ?? 0),
    percentage: Number(row.percentage) ?? 0,
    streakDays: Number(row.streak_days ?? 0),
    lastActivityDate: row.last_activity_date,
    areaStats: (row.area_stats as Record<string, unknown>) || {},
    updatedAt: row.updated_at,
  };
};

function ensureSupabase() {
  if (!supabase) throw new Error('Supabase no configurado');
  return supabase;
}

const ProgressSupabaseService = {
  async getByUserId(userId: string): Promise<MappedProgress | null> {
    const sb = ensureSupabase();
    const { data, error } = await sb
      .from(TABLE)
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw new Error(`Error leyendo progreso: ${error.message}`);
    return data ? mapFromDb(data as Record<string, unknown>) : null;
  },

  async upsert(userId: string, progressData: Record<string, unknown>): Promise<MappedProgress> {
    const sb = ensureSupabase();
    const pd = progressData as {
      totalAttempts?: number;
      total_attempts?: number;
      totalCorrect?: number;
      total_correct?: number;
      percentage?: number;
      streakDays?: number;
      streak_days?: number;
      lastActivityDate?: unknown;
      last_activity_date?: unknown;
      areaStats?: Record<string, unknown>;
      area_stats?: Record<string, unknown>;
    };
    const payload = {
      user_id: userId,
      total_attempts: pd.totalAttempts ?? pd.total_attempts ?? 0,
      total_correct: pd.totalCorrect ?? pd.total_correct ?? 0,
      percentage: pd.percentage ?? 0,
      streak_days: pd.streakDays ?? pd.streak_days ?? 0,
      last_activity_date: pd.lastActivityDate ?? pd.last_activity_date,
      area_stats: pd.areaStats ?? pd.area_stats ?? {},
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await sb
      .from(TABLE)
      .upsert(payload, { onConflict: 'user_id' })
      .select()
      .single();
    if (error) throw new Error(`Error guardando progreso: ${error.message}`);
    return mapFromDb(data as Record<string, unknown>)!;
  },

  async update(userId: string, updates: Record<string, unknown>): Promise<MappedProgress> {
    const fetched = await this.getByUserId(userId);
    const current: Partial<MappedProgress> = fetched ?? {};
    const merged = {
      totalAttempts: updates.totalAttempts ?? current.totalAttempts ?? 0,
      totalCorrect: updates.totalCorrect ?? current.totalCorrect ?? 0,
      percentage: updates.percentage ?? current.percentage ?? 0,
      streakDays: updates.streakDays ?? current.streakDays ?? 0,
      lastActivityDate: updates.lastActivityDate ?? current.lastActivityDate,
      areaStats: { ...(current.areaStats || {}), ...(updates.areaStats || {}) },
    };
    return this.upsert(userId, merged);
  },
};

export default ProgressSupabaseService;
