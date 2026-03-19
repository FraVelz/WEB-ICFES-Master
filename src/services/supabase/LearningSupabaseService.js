/**
 * LearningSupabaseService - Obtener contenido de aprendizaje desde Supabase
 */
import { supabase } from '@/config/supabase';

const TABLE = 'learning_content';

const getSupabase = () => {
  if (!supabase) return null;
  return supabase;
};

const AREA_MAP = {
  matematicas: 'matematicas',
  mathematics: 'matematicas',
  'lectura-critica': 'lectura_critica',
  lenguaje: 'lectura_critica',
  'ciencias-naturales': 'ciencias_naturales',
  ciencias: 'ciencias_naturales',
  'sociales-ciudadanas': 'sociales',
  sociales: 'sociales',
  ingles: 'ingles',
};

const LearningSupabaseService = {
  /**
   * Obtener lecciones por área desde learning_content
   */
  async getLessonsByArea(area) {
    const sb = getSupabase();
    if (!sb) return [];
    const normalizedArea = AREA_MAP[area] || area.replace(/-/g, '_');
    const { data, error } = await sb
      .from(TABLE)
      .select('*')
      .eq('area', normalizedArea)
      .eq('published', true)
      .order('order_index', { ascending: true });

    if (error)
      throw new Error(`Error leyendo learning_content: ${error.message}`);

    if (!data || data.length === 0) return [];

    return data.map((row) => {
      const content = row.content || {};
      return {
        id: row.id,
        area: row.area,
        title: content.title || row.id,
        summary: content.summary,
        questions: content.questions || [],
        quiz: content.quiz,
        type: content.type || 'lesson',
        order: row.order_index ?? 0,
        ...content,
      };
    });
  },

  /**
   * Obtener una lección por ID
   */
  async getLesson(lessonId) {
    const sb = getSupabase();
    if (!sb) return null;
    const { data, error } = await sb
      .from(TABLE)
      .select('*')
      .eq('id', lessonId)
      .maybeSingle();
    if (error) throw new Error(`Error leyendo lección: ${error.message}`);
    if (!data) return null;
    const content = data.content || {};
    return {
      id: data.id,
      area: data.area,
      title: content.title || data.id,
      summary: content.summary,
      questions: content.questions || [],
      quiz: content.quiz,
      ...content,
    };
  },
};

export default LearningSupabaseService;
