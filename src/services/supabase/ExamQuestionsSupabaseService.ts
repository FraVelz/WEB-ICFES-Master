/**
 * ExamQuestionsSupabaseService — banco de preguntas ICFES desde Supabase
 */
import { routeAreaToDbArea } from '@/features/exam/data/examAreas';
import type { ExamQuestion } from '@/features/exam/types/question';
import type { QuestionOption } from '@/features/exam/types/question';
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
  };
}

const ExamQuestionsSupabaseService = {
  async getByRouteArea(routeArea: string): Promise<ExamQuestion[]> {
    const sb = getSupabase();
    if (!sb) return [];

    const dbArea = routeAreaToDbArea(routeArea);
    if (!dbArea) return [];

    const { data, error } = await sb
      .from(PUBLIC_VIEW)
      .select(PUBLIC_COLUMNS)
      .eq('area', dbArea)
      .eq('published', true)
      .order('order_index', { ascending: true });

    if (error) throw new Error(`Error leyendo exam_questions: ${error.message}`);
    return ((data ?? []) as ExamQuestionPublicRow[]).map(rowToPublicExamQuestion);
  },

  async getByRouteAreas(routeAreas: string[]): Promise<ExamQuestion[]> {
    const results = await Promise.all(routeAreas.map((area) => this.getByRouteArea(area)));
    return results.flat();
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
};

export default ExamQuestionsSupabaseService;
