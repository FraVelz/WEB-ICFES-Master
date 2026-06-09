/**
 * ExamSupabaseService - Gestión de exámenes en Supabase (exam_results)
 */
import { supabase } from '@/config/supabase';

const TABLE = 'exam_results';

export interface ExamFilters {
  type?: string;
  limit?: number;
}

function ensureSupabase() {
  if (!supabase) throw new Error('Supabase no configurado');
  return supabase;
}

const ExamSupabaseService = {
  async getByUserId(userId: string, filters: ExamFilters = {}): Promise<Record<string, unknown>[]> {
    const sb = ensureSupabase();
    let query = sb.from(TABLE).select('*').eq('user_id', userId).order('completed_at', { ascending: false });
    if (filters.type) query = query.eq('exam_type', filters.type);
    if (filters.limit) query = query.limit(filters.limit);
    const { data, error } = await query;
    if (error) throw new Error(`Error leyendo exámenes: ${error.message}`);
    return data || [];
  },

  async getById(examId: string): Promise<Record<string, unknown> | null> {
    const sb = ensureSupabase();
    const { data, error } = await sb.from(TABLE).select('*').eq('id', examId).maybeSingle();
    if (error) throw new Error(`Error leyendo examen: ${error.message}`);
    return data;
  },

  async resetUserExams(userId: string): Promise<{ success: boolean }> {
    const sb = ensureSupabase();
    const { error } = await sb.from(TABLE).delete().eq('user_id', userId);
    if (error) throw new Error(`Error eliminando exámenes: ${error.message}`);
    return { success: true };
  },

  /** Inserta un intento; no duplica si el ID ya existe. */
  async insertMigratedAttempt(row: Record<string, unknown>): Promise<boolean> {
    const id = String(row.id ?? '');
    if (!id) return false;

    const existing = await this.getById(id);
    if (existing) return false;

    const sb = ensureSupabase();
    const { error } = await sb.from(TABLE).insert(row).select().single();
    if (error) throw new Error(`Error guardando examen: ${error.message}`);
    return true;
  },
};

export default ExamSupabaseService;
