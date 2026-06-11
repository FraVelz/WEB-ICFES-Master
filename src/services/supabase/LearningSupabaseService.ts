/**
 * LearningSupabaseService - Obtener contenido de aprendizaje desde Supabase
 */
import { supabase } from '@/config/supabase';
import {
  normalizeLessonPhase,
  phaseToSectionId,
  type LearningPhaseNumber,
} from '@/features/learning/constants/learningPhases';

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

function mapLessonRow(row: Record<string, unknown>) {
  const content = (row.content || {}) as Record<string, unknown>;
  const lessonBody =
    typeof content.body === 'string' ? content.body : typeof content.content === 'string' ? content.content : undefined;

  const phase = normalizeLessonPhase(row.phase ?? content.phase ?? content.fase ?? content.difficulty);

  return {
    ...content,
    id: row.id,
    area: row.area,
    phase,
    title: (content.title as string) || row.id,
    summary: content.summary,
    body: lessonBody,
    questions: content.questions || [],
    quiz: content.quiz,
    type: content.type || 'lesson',
    order: row.order_index ?? 0,
    difficulty: phaseToSectionId(phase),
  };
}

const LearningSupabaseService = {
  /**
   * Lecciones por área. Si `phase` está definido, solo esa fase (1, 2 o 3).
   */
  async getLessonsByArea(area: string, phase?: LearningPhaseNumber): Promise<Record<string, unknown>[]> {
    const sb = getSupabase();
    if (!sb) return [];
    const normalizedArea = (AREA_MAP as Record<string, string>)[area] ?? area.replace(/-/g, '_');

    let query = sb.from(TABLE).select('*').eq('area', normalizedArea).eq('published', true);

    if (phase !== undefined) {
      query = query.eq('phase', phase);
    }

    const { data, error } = await query.order('order_index', { ascending: true });

    if (error) throw new Error(`Error leyendo learning_content: ${error.message}`);

    if (!data || data.length === 0) return [];

    return data.map((row) => mapLessonRow(row as Record<string, unknown>));
  },

  async getLesson(lessonId: string) {
    const sb = getSupabase();
    if (!sb) return null;
    const { data, error } = await sb.from(TABLE).select('*').eq('id', lessonId).eq('published', true).maybeSingle();
    if (error) throw new Error(`Error leyendo lección: ${error.message}`);
    if (!data) return null;
    return mapLessonRow(data as Record<string, unknown>);
  },
};

export default LearningSupabaseService;
