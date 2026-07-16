/**
 * ExamQuestionsSupabaseService — banco de preguntas ICFES desde Supabase
 */
import { routeAreaToDbArea, type ExamQuestionDbArea } from '@/features/exam/data/examAreas';
import type { ExamQuestionDifficulty } from '@/features/exam/data/phaseSkipDifficulty';
import type { ExamQuestion, QuestionOption } from '@/features/exam/types/question';
import { supabase } from '@/config/supabase';

const PUBLIC_VIEW = 'exam_questions_public';

/** Columnas expuestas al cliente (sin respuesta correcta). */
const PUBLIC_COLUMNS = 'id, area, text, options, explanation, difficulty, published, order_index' as const;

export interface ExamQuestionPublicRow {
  id: string;
  area: string;
  text: string;
  options: QuestionOption[] | unknown;
  explanation: string | null;
  difficulty: string | null;
  published: boolean;
  order_index: number;
  /** Present after migration + view update; defaults to 1 in mapper. */
  version?: number | null;
}

const getSupabase = () => {
  if (!supabase) return null;
  return supabase;
};

function rowToPublicExamQuestion(row: ExamQuestionPublicRow): ExamQuestion {
  const options = Array.isArray(row.options) ? (row.options as QuestionOption[]) : [];

  return {
    id: row.id,
    text: row.text,
    options,
    correctAnswer: '',
    explanation: row.explanation ?? undefined,
    difficulty: row.difficulty ?? undefined,
    version: typeof row.version === 'number' && row.version >= 1 ? row.version : 1,
  };
}

const ExamQuestionsSupabaseService = {
  async getByRouteArea(
    routeArea: string,
    limit?: number,
    difficulty?: ExamQuestionDifficulty | null
  ): Promise<ExamQuestion[]> {
    const sb = getSupabase();
    if (!sb) return [];

    const dbArea = routeAreaToDbArea(routeArea);
    if (!dbArea) return [];

    let query = sb
      .from(PUBLIC_VIEW)
      .select(PUBLIC_COLUMNS)
      .eq('area', dbArea)
      .eq('published', true)
      .order('order_index', { ascending: true });

    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }

    if (limit != null && limit > 0) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw new Error(`Error leyendo exam_questions: ${error.message}`);
    return ((data ?? []) as ExamQuestionPublicRow[]).map(rowToPublicExamQuestion);
  },

  async getByRouteAreas(routeAreas: string[]): Promise<ExamQuestion[]> {
    const sb = getSupabase();
    if (!sb || routeAreas.length === 0) return [];

    const dbAreas = [
      ...new Set(routeAreas.map(routeAreaToDbArea).filter((area): area is ExamQuestionDbArea => area != null)),
    ];
    if (dbAreas.length === 0) return [];

    const { data, error } = await sb
      .from(PUBLIC_VIEW)
      .select(PUBLIC_COLUMNS)
      .in('area', dbAreas)
      .eq('published', true)
      .order('area', { ascending: true })
      .order('order_index', { ascending: true });

    if (error) throw new Error(`Error leyendo exam_questions: ${error.message}`);
    return ((data ?? []) as ExamQuestionPublicRow[]).map(rowToPublicExamQuestion);
  },

  async getByIds(ids: string[]): Promise<ExamQuestion[]> {
    const sb = getSupabase();
    if (!sb || ids.length === 0) return [];

    const { data, error } = await sb.from(PUBLIC_VIEW).select(PUBLIC_COLUMNS).in('id', ids).eq('published', true);

    if (error) throw new Error(`Error leyendo exam_questions: ${error.message}`);
    return ((data ?? []) as ExamQuestionPublicRow[]).map(rowToPublicExamQuestion);
  },

  async getAllPublished(): Promise<ExamQuestion[]> {
    const sb = getSupabase();
    if (!sb) return [];

    const { data, error } = await sb
      .from(PUBLIC_VIEW)
      .select(PUBLIC_COLUMNS)
      .eq('published', true)
      .order('area', { ascending: true })
      .order('order_index', { ascending: true });

    if (error) throw new Error(`Error leyendo exam_questions: ${error.message}`);
    return ((data ?? []) as ExamQuestionPublicRow[]).map(rowToPublicExamQuestion);
  },

  /** Conteos live de preguntas publicadas por slug de ruta (`HOME_AREA_IDS`). */
  async countPublishedByRouteAreas(routeAreas: string[]): Promise<Record<string, number>> {
    const counts: Record<string, number> = Object.fromEntries(routeAreas.map((area) => [area, 0]));
    const sb = getSupabase();
    if (!sb || routeAreas.length === 0) return counts;

    const pairs = routeAreas
      .map((routeArea) => {
        const dbArea = routeAreaToDbArea(routeArea);
        return dbArea ? { routeArea, dbArea } : null;
      })
      .filter((pair): pair is { routeArea: string; dbArea: ExamQuestionDbArea } => pair != null);

    await Promise.all(
      pairs.map(async ({ routeArea, dbArea }) => {
        const { count, error } = await sb
          .from(PUBLIC_VIEW)
          .select('id', { count: 'exact', head: true })
          .eq('area', dbArea)
          .eq('published', true);

        if (error) throw new Error(`Error contando exam_questions: ${error.message}`);
        counts[routeArea] = count ?? 0;
      })
    );

    return counts;
  },
};

export default ExamQuestionsSupabaseService;
