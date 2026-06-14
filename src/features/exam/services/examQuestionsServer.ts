import 'server-only';

import { unstable_cache } from 'next/cache';
import {
  getStaticQuestionsByRouteArea,
  getStaticQuestionsForFullExam,
} from '@/features/exam/data/examStaticPool.server';
import { FULL_EXAM_ROUTE_AREAS } from '@/features/exam/data/examAreas';
import { toPublicExamQuestion, type ExamQuestion, type ExamQuestionPublic } from '@/features/exam/types/question';
import ExamQuestionsSupabaseService from '@/services/supabase/ExamQuestionsSupabaseService';
import { getExamQuestionsByIdsForGrading } from '@/services/supabase/ExamQuestionsServerService';

const CACHE_REVALIDATE_SECONDS = 20 * 60;

function toPublicList(questions: ExamQuestion[]): ExamQuestionPublic[] {
  return questions.map(toPublicExamQuestion);
}

async function loadFromDbByRouteArea(routeArea: string, limit?: number): Promise<ExamQuestionPublic[]> {
  const fromDb = await ExamQuestionsSupabaseService.getByRouteArea(routeArea, limit);
  return fromDb.length > 0 ? toPublicList(fromDb) : [];
}

async function loadFromDbForFullExam(): Promise<ExamQuestionPublic[]> {
  const fromDb = await ExamQuestionsSupabaseService.getByRouteAreas([...FULL_EXAM_ROUTE_AREAS]);
  return fromDb.length > 0 ? toPublicList(fromDb) : [];
}

const getCachedDbQuestionsByRouteArea = (routeArea: string, limit?: number) =>
  unstable_cache(
    () => loadFromDbByRouteArea(routeArea, limit),
    ['exam-questions-area', routeArea, String(limit ?? 'all')],
    { revalidate: CACHE_REVALIDATE_SECONDS }
  );

const getCachedDbQuestionsForFullExam = unstable_cache(
  loadFromDbForFullExam,
  ['exam-questions-full-exam'],
  { revalidate: CACHE_REVALIDATE_SECONDS }
);

export async function fetchPublicQuestionsByRouteArea(
  routeArea: string,
  limit?: number
): Promise<ExamQuestionPublic[]> {
  const fallback = getStaticQuestionsByRouteArea(routeArea);
  const cappedFallback = limit != null && limit > 0 ? fallback.slice(0, limit) : fallback;

  try {
    const fromDb = await getCachedDbQuestionsByRouteArea(routeArea, limit)();
    if (fromDb.length > 0) return fromDb;
  } catch (error) {
    console.warn('[examQuestionsServer] Supabase fallback for area', routeArea, error);
  }

  return toPublicList(cappedFallback);
}

export async function fetchPublicQuestionsForFullExam(): Promise<ExamQuestionPublic[]> {
  const fallback = getStaticQuestionsForFullExam();

  try {
    const fromDb = await getCachedDbQuestionsForFullExam();
    if (fromDb.length > 0) return fromDb;
  } catch (error) {
    console.warn('[examQuestionsServer] Supabase fallback for full exam', error);
  }

  return toPublicList(fallback);
}

export async function loadQuestionsByIdsForGrading(ids: string[]): Promise<ExamQuestion[]> {
  const uniqueIds = [...new Set(ids)];
  const staticPool = getStaticQuestionsForFullExam();
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
