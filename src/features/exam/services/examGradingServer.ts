import {
  ENGLISH_QUESTIONS,
  LANGUAGE_QUESTIONS,
  MATHEMATICS_QUESTIONS,
  SCIENCE_QUESTIONS,
  SOCIAL_QUESTIONS,
} from '@/features/exam/data';
import { FULL_EXAM_ROUTE_AREAS } from '@/features/exam/data/examAreas';
import type { ExamQuestion } from '@/features/exam/types/question';
import ExamQuestionsSupabaseService from '@/services/supabase/ExamQuestionsSupabaseService';

const STATIC_POOL: ExamQuestion[] = [
  ...LANGUAGE_QUESTIONS,
  ...MATHEMATICS_QUESTIONS,
  ...SCIENCE_QUESTIONS,
  ...SOCIAL_QUESTIONS,
  ...ENGLISH_QUESTIONS,
];

export type GradedExamAnswer = {
  questionId: string;
  correct: boolean;
  userAnswer: string;
  correctAnswer: string;
  explanation?: string;
  text: string;
  options: ExamQuestion['options'];
};

async function loadQuestionsByIds(ids: string[]): Promise<ExamQuestion[]> {
  const uniqueIds = [...new Set(ids)];
  const staticMatches = STATIC_POOL.filter((q) => uniqueIds.includes(q.id));

  try {
    const fromDb = await ExamQuestionsSupabaseService.getByIds(uniqueIds);
    const merged = new Map<string, ExamQuestion>();
    for (const question of [...staticMatches, ...fromDb]) {
      merged.set(question.id, question);
    }
    return uniqueIds.map((id) => merged.get(id)).filter((q): q is ExamQuestion => Boolean(q));
  } catch {
    return staticMatches;
  }
}

export async function gradeExamAnswers(answers: Record<string, string>): Promise<GradedExamAnswer[]> {
  const ids = Object.keys(answers);
  const questions = await loadQuestionsByIds(ids);

  return questions.map((question) => {
    const userAnswer = answers[question.id] ?? '';
    return {
      questionId: question.id,
      correct: userAnswer === question.correctAnswer,
      userAnswer,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      text: question.text,
      options: question.options,
    };
  });
}

export async function gradeFullExamPool(answers: Record<string, string>): Promise<GradedExamAnswer[]> {
  return gradeExamAnswers(answers);
}

export const FULL_EXAM_AREA_IDS = FULL_EXAM_ROUTE_AREAS;
