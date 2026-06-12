/**
 * Lectura de exam_questions con service role — solo servidor (calificación, scripts).
 */
import { routeAreaToDbArea } from '@/features/exam/data/examAreas';
import type { ExamQuestion } from '@/features/exam/types/question';
import type { QuestionOption } from '@/features/exam/types/question';
import { createServiceRoleClient } from '@/config/supabaseServiceRole';

const TABLE = 'exam_questions';

const GRADING_COLUMNS = 'id, area, text, options, correct_answer, explanation, difficulty, published, order_index' as const;

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

function rowToExamQuestion(row: ExamQuestionRow): ExamQuestion {
  const options = Array.isArray(row.options) ? (row.options as QuestionOption[]) : [];

  return {
    id: row.id,
    text: row.text,
    options,
    correctAnswer: row.correct_answer ?? '',
    explanation: row.explanation ?? undefined,
    difficulty: row.difficulty ?? undefined,
  };
}

export async function getExamQuestionsByIdsForGrading(ids: string[]): Promise<ExamQuestion[]> {
  const sb = createServiceRoleClient();
  if (!sb || ids.length === 0) return [];

  const uniqueIds = [...new Set(ids)];
  const { data, error } = await sb
    .from(TABLE)
    .select(GRADING_COLUMNS)
    .in('id', uniqueIds)
    .eq('published', true);

  if (error) throw new Error(`Error leyendo exam_questions (grading): ${error.message}`);
  return ((data ?? []) as ExamQuestionRow[]).map(rowToExamQuestion);
}

export async function getExamQuestionsByRouteAreaForGrading(routeArea: string): Promise<ExamQuestion[]> {
  const sb = createServiceRoleClient();
  if (!sb) return [];

  const dbArea = routeAreaToDbArea(routeArea);
  if (!dbArea) return [];

  const { data, error } = await sb
    .from(TABLE)
    .select(GRADING_COLUMNS)
    .eq('area', dbArea)
    .eq('published', true)
    .order('order_index', { ascending: true });

  if (error) throw new Error(`Error leyendo exam_questions (grading): ${error.message}`);
  return ((data ?? []) as ExamQuestionRow[]).map(rowToExamQuestion);
}
