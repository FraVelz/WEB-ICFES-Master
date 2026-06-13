/**
 * LearningSupabaseService - Obtener contenido de aprendizaje desde Supabase
 */
import { supabase } from '@/config/supabase';
import {
  normalizeLessonPhase,
  phaseToSectionId,
  type LearningPhaseNumber,
} from '@/features/learning/constants/learningPhases';
import type { LearningPathLesson } from '@/features/learning/services/LearningService';
import type { AreaId } from '@/shared/constants';
import {
  groupRoadmapRowsByArea,
  LEARNING_ROADMAP_COLUMNS,
  mapRoadmapRowToLesson,
} from '@/services/learning/learningCatalogMap';
import { stripQuizAnswersFromContent } from '@/utils/stripQuizAnswers';

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

function mapFullLessonRow(row: Record<string, unknown>) {
  const content = stripQuizAnswersFromContent((row.content || {}) as Record<string, unknown>);
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
  /** Catálogo ligero (sin body/quiz) — 1 query; opcional filtro por fase. */
  async fetchPublishedRoadmapCatalog(phase?: LearningPhaseNumber): Promise<Partial<Record<AreaId, LearningPathLesson[]>>> {
    const sb = getSupabase();
    if (!sb) return {};

    let query = sb.from(TABLE).select(LEARNING_ROADMAP_COLUMNS).eq('published', true);

    if (phase !== undefined) {
      query = query.eq('phase', phase);
    }

    let { data, error } = await query.order('order_index', { ascending: true });

    if (error) {
      let fallbackQuery = sb.from(TABLE).select('id, area, phase, order_index, content').eq('published', true);
      if (phase !== undefined) {
        fallbackQuery = fallbackQuery.eq('phase', phase);
      }
      const fallback = await fallbackQuery.order('order_index', { ascending: true });
      if (fallback.error) throw new Error(`Error leyendo learning_content: ${fallback.error.message}`);
      data = fallback.data;
      error = null;
    }

    if (error) throw new Error(`Error leyendo learning_content: ${error.message}`);
    return groupRoadmapRowsByArea((data ?? []) as Record<string, unknown>[]);
  },

  /**
   * Lecciones por área con contenido completo (vista de lección).
   * Preferir `fetchPublishedRoadmapCatalog` para roadmap/perfil/logros.
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

    return data.map((row) => mapFullLessonRow(row as Record<string, unknown>));
  },

  async getLesson(lessonId: string) {
    const sb = getSupabase();
    if (!sb) return null;
    const { data, error } = await sb.from(TABLE).select('*').eq('id', lessonId).eq('published', true).maybeSingle();
    if (error) throw new Error(`Error leyendo lección: ${error.message}`);
    if (!data) return null;
    return mapFullLessonRow(data as Record<string, unknown>);
  },

  /** Roadmap ligero filtrado por área (sin query extra si el caller ya tiene el catálogo). */
  filterRoadmapCatalog(
    catalog: Partial<Record<AreaId, LearningPathLesson[]>>,
    areaId: AreaId,
    phase?: LearningPhaseNumber
  ): LearningPathLesson[] {
    const lessons = catalog[areaId] ?? [];
    if (phase === undefined) return [...lessons];
    return lessons.filter((lesson) => lesson.phase === phase);
  },

  mapRoadmapRowToLesson,
};

export default LearningSupabaseService;
