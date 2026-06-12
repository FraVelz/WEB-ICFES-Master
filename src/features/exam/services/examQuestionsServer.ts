import {
  ENGLISH_QUESTIONS,
  LANGUAGE_QUESTIONS,
  MATHEMATICS_QUESTIONS,
  SCIENCE_QUESTIONS,
  SOCIAL_QUESTIONS,
} from '@/features/exam/data';
import { FULL_EXAM_ROUTE_AREAS } from '@/features/exam/data/examAreas';
import { toPublicExamQuestion, type ExamQuestion, type ExamQuestionPublic } from '@/features/exam/types/question';
import ExamQuestionsSupabaseService from '@/services/supabase/ExamQuestionsSupabaseService';
import { getExamQuestionsByIdsForGrading } from '@/services/supabase/ExamQuestionsServerService';

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

export async function fetchPublicQuestionsByRouteArea(routeArea: string): Promise<ExamQuestionPublic[]> {
  const fallback = getStaticByRouteArea(routeArea);

  try {
    const fromDb = await ExamQuestionsSupabaseService.getByRouteArea(routeArea);
    if (fromDb.length > 0) return toPublicList(fromDb);
  } catch (error) {
    console.warn('[examQuestionsServer] Supabase fallback for area', routeArea, error);
  }

  return toPublicList(fallback);
}

export async function fetchPublicQuestionsForFullExam(): Promise<ExamQuestionPublic[]> {
  const fallback = getStaticForFullExam();

  try {
    const fromDb = await ExamQuestionsSupabaseService.getByRouteAreas([...FULL_EXAM_ROUTE_AREAS]);
    if (fromDb.length > 0) return toPublicList(fromDb);
  } catch (error) {
    console.warn('[examQuestionsServer] Supabase fallback for full exam', error);
  }

  return toPublicList(fallback);
}

export async function loadQuestionsByIdsForGrading(ids: string[]): Promise<ExamQuestion[]> {
  const uniqueIds = [...new Set(ids)];
  const staticPool = getStaticForFullExam();
  const staticMatches = staticPool.filter((q) => uniqueIds.includes(q.id));

  try {
    const fromDb = await getExamQuestionsByIdsForGrading(uniqueIds);
    const merged = new Map<string, ExamQuestion>();
    for (const question of [...staticMatches, ...fromDb]) {
      merged.set(question.id, question);
    }
    return uniqueIds.map((id) => merged.get(id)).filter((q): q is ExamQuestion => Boolean(q));
  } catch {
    return staticMatches;
  }
}
