/**
 * ExamSupabaseService - Gestión de exámenes en Supabase (exam_results)
 */
import { supabase } from '@/config/supabase';

const TABLE = 'exam_results';

const ExamSupabaseService = {
  async getByUserId(userId, filters = {}) {
    let query = supabase
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

  async getById(examId) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', examId)
      .maybeSingle();
    if (error) throw new Error(`Error leyendo examen: ${error.message}`);
    return data;
  },

  async create(userId, examData) {
    const id = `exam_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const payload = {
      id,
      user_id: userId,
      exam_type: examData.type || 'practice',
      score: null,
      total_questions:
        examData.questions?.length || examData.totalQuestions || 0,
      correct_answers: 0,
      time_spent: 0,
      completed_at: null,
      questions: examData.questions || [],
    };
    const { data, error } = await supabase
      .from(TABLE)
      .insert(payload)
      .select()
      .single();
    if (error) throw new Error(`Error creando examen: ${error.message}`);
    return data;
  },

  async complete(
    examId,
    score,
    correctAnswers,
    totalQuestions,
    timeSpent,
    answers = []
  ) {
    const payload = {
      score,
      correct_answers: correctAnswers,
      total_questions: totalQuestions,
      time_spent: timeSpent || 0,
      completed_at: new Date().toISOString(),
      questions: answers,
    };
    const { data, error } = await supabase
      .from(TABLE)
      .update(payload)
      .eq('id', examId)
      .select()
      .single();
    if (error) throw new Error(`Error completando examen: ${error.message}`);
    return data;
  },

  async resetUserExams(userId) {
    const { error } = await supabase.from(TABLE).delete().eq('user_id', userId);
    if (error) throw new Error(`Error eliminando exámenes: ${error.message}`);
    return { success: true };
  },
};

export default ExamSupabaseService;
