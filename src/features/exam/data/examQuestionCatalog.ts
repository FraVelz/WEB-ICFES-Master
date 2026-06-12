import 'server-only';

import type { ExamQuestionDbArea } from '@/features/exam/data/examAreas';
import {
  LANGUAGE_QUESTIONS,
  MATHEMATICS_QUESTIONS,
  SCIENCE_QUESTIONS,
  SOCIAL_QUESTIONS,
} from '@/features/exam/data/areaQuestions';
import { ENGLISH_QUESTIONS } from '@/features/exam/data/questions';
import type { ExamQuestion } from '@/features/exam/types/question';

export type ExamQuestionCatalogEntry = ExamQuestion & {
  area: ExamQuestionDbArea;
  order_index: number;
};

function withArea(area: ExamQuestionDbArea, questions: ExamQuestion[]): ExamQuestionCatalogEntry[] {
  return questions.map((question, index) => ({
    ...question,
    area,
    order_index: index + 1,
  }));
}

/** Catálogo estático usado como fallback y para el seed inicial en Supabase. */
export const EXAM_QUESTION_CATALOG: ExamQuestionCatalogEntry[] = [
  ...withArea('matematicas', MATHEMATICS_QUESTIONS),
  ...withArea('lectura_critica', LANGUAGE_QUESTIONS),
  ...withArea('ciencias_naturales', SCIENCE_QUESTIONS),
  ...withArea('sociales', SOCIAL_QUESTIONS),
  ...withArea('ingles', ENGLISH_QUESTIONS),
];

export function catalogEntryToRow(entry: ExamQuestionCatalogEntry) {
  return {
    id: entry.id,
    area: entry.area,
    text: entry.text,
    options: entry.options,
    correct_answer: entry.correctAnswer,
    explanation: entry.explanation ?? null,
    difficulty: entry.difficulty ?? null,
    published: true,
    order_index: entry.order_index,
  };
}
