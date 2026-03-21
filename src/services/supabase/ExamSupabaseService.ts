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
    let query = sb
      .from(TABLE)
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });
    if (filters.type) query = query.eq('exam_type', filters.type);
    if (filters.limit) query = query.limit(filters.limit);
    const { data, error } = await query;
    if (error) throw new Error(`Error leyendo exámenes: ${error.message}`);
    return data || [];
  },

  async getById(examId: string): Promise<Record<string, unknown> | null> {
    const sb = ensureSupabase();
    const { data, error } = await sb
      .from(TABLE)
      .select('*')
      .eq('id', examId)
      .maybeSingle();
    if (error) throw new Error(`Error leyendo examen: ${error.message}`);
    return data;
  },

  async create(userId: string, examData: Record<string, unknown>): Promise<Record<string, unknown>> {
    const sb = ensureSupabase();
    const ed = examData as { type?: string; questions?: unknown[]; totalQuestions?: number };
    const id = `exam_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const payload = {
      id,
      user_id: userId,
      exam_type: ed.type || 'practice',
      score: null,
      total_questions:
        (ed.questions as unknown[])?.length || ed.totalQuestions || 0,
      correct_answers: 0,
      time_spent: 0,
      completed_at: null,
      questions: ed.questions || [],
    };
    const { data, error } = await sb
      .from(TABLE)
      .insert(payload)
      .select()
      .single();
    if (error) throw new Error(`Error creando examen: ${error.message}`);
    return data;
  },

  async complete(
    examId: string,
    score: number,
    correctAnswers: number,
    totalQuestions: number,
    timeSpent: number,
    answers: unknown[] = []
  ): Promise<Record<string, unknown>> {
    const payload = {
      score,
      correct_answers: correctAnswers,
      total_questions: totalQuestions,
      time_spent: timeSpent || 0,
      completed_at: new Date().toISOString(),
      questions: answers,
    };
    const sb = ensureSupabase();
    const { data, error } = await sb
      .from(TABLE)
      .update(payload)
      .eq('id', examId)
      .select()
      .single();
    if (error) throw new Error(`Error completando examen: ${error.message}`);
    return data;
  },

  async resetUserExams(userId: string): Promise<{ success: boolean }> {
    const sb = ensureSupabase();
    const { error } = await sb.from(TABLE).delete().eq('user_id', userId);
    if (error) throw new Error(`Error eliminando exámenes: ${error.message}`);
    return { success: true };
  },
};

export default ExamSupabaseService;
