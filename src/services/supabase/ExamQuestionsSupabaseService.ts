/**
 * ExamQuestionsSupabaseService — banco de preguntas ICFES desde Supabase
 */
import { routeAreaToDbArea } from '@/features/exam/data/examAreas';
import type { ExamQuestion } from '@/features/exam/types/question';
import type { QuestionOption } from '@/features/exam/types/question';
import { supabase } from '@/config/supabase';

const TABLE = 'exam_questions';

export interface ExamQuestionRow {
  id: string;
  area: string;
  text: string;
  options: QuestionOption[] | unknown;
  correct_answer: string;
  explanation: string | null;
  difficulty: string | null;
  published: boolean;
  order_index: number;
}

const getSupabase = () => {
  if (!supabase) return null;
  return supabase;
};

function rowToExamQuestion(row: ExamQuestionRow): ExamQuestion {
  const options = Array.isArray(row.options) ? (row.options as QuestionOption[]) : [];

  return {
    id: row.id,
    text: row.text,
    options,
    correctAnswer: row.correct_answer,
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
      .from(TABLE)
      .select('*')
      .eq('area', dbArea)
      .eq('published', true)
      .order('order_index', { ascending: true });

    if (error) throw new Error(`Error leyendo exam_questions: ${error.message}`);
    return ((data ?? []) as ExamQuestionRow[]).map(rowToExamQuestion);
  },

  async getByRouteAreas(routeAreas: string[]): Promise<ExamQuestion[]> {
    const results = await Promise.all(routeAreas.map((area) => this.getByRouteArea(area)));
    return results.flat();
  },

  async getAllPublished(): Promise<ExamQuestion[]> {
    const sb = getSupabase();
    if (!sb) return [];

    const { data, error } = await sb
      .from(TABLE)
      .select('*')
      .eq('published', true)
      .order('area', { ascending: true })
      .order('order_index', { ascending: true });

    if (error) throw new Error(`Error leyendo exam_questions: ${error.message}`);
    return ((data ?? []) as ExamQuestionRow[]).map(rowToExamQuestion);
  },
};

export default ExamQuestionsSupabaseService;
