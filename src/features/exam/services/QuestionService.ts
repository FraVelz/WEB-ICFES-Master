import {
  ENGLISH_QUESTIONS,
  LANGUAGE_QUESTIONS,
  MATHEMATICS_QUESTIONS,
  SCIENCE_QUESTIONS,
  SOCIAL_QUESTIONS,
} from '@/features/exam/data';
import { FULL_EXAM_ROUTE_AREAS } from '@/features/exam/data/examAreas';
import {
  toPublicExamQuestion,
  type ExamQuestion,
  type ExamQuestionPublic,
} from '@/features/exam/types/question';
import ExamQuestionsSupabaseService from '@/services/supabase/ExamQuestionsSupabaseService';

const STATIC_BY_ROUTE: Record<string, ExamQuestion[]> = {
  'lectura-critica': LANGUAGE_QUESTIONS,
  matematicas: MATHEMATICS_QUESTIONS,
  'ciencias-naturales': SCIENCE_QUESTIONS,
  'sociales-ciudadanas': SOCIAL_QUESTIONS,
  ingles: ENGLISH_QUESTIONS,
};

function getStaticByRouteArea(routeArea: string): ExamQuestion[] {
  return STATIC_BY_ROUTE[routeArea] ?? [];
}

function getStaticForFullExam(): ExamQuestion[] {
  return FULL_EXAM_ROUTE_AREAS.flatMap((area) => getStaticByRouteArea(area));
}

function toPublicList(questions: ExamQuestion[]): ExamQuestionPublic[] {
  return questions.map(toPublicExamQuestion);
}

export async function fetchQuestionsByRouteArea(routeArea: string): Promise<ExamQuestionPublic[]> {
  const fallback = getStaticByRouteArea(routeArea);

  try {
    const fromDb = await ExamQuestionsSupabaseService.getByRouteArea(routeArea);
    if (fromDb.length > 0) return toPublicList(fromDb);
  } catch (error) {
    console.warn('[QuestionService] Supabase fallback for area', routeArea, error);
  }

  return toPublicList(fallback);
}

export async function fetchQuestionsForFullExam(): Promise<ExamQuestionPublic[]> {
  const fallback = getStaticForFullExam();

  try {
    const fromDb = await ExamQuestionsSupabaseService.getByRouteAreas([...FULL_EXAM_ROUTE_AREAS]);
    if (fromDb.length > 0) return toPublicList(fromDb);
  } catch (error) {
    console.warn('[QuestionService] Supabase fallback for full exam', error);
  }

  return toPublicList(fallback);
}
