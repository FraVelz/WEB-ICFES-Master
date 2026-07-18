import 'server-only';

import { unstable_cache } from 'next/cache';
import type { ExamQuestionDifficulty } from '@/features/exam/data/phaseSkipDifficulty';
import {
  getStaticQuestionsByRouteArea,
  getStaticQuestionsForFullExam,
} from '@/features/exam/data/examStaticPool.server';
import { FULL_EXAM_ROUTE_AREAS } from '@/features/exam/data/examAreas';
import { FULL_EXAM_MAX_QUESTIONS } from '@/features/exam/constants/fullExamLimits';
import { zeroCoverageForAreas } from '@/features/exam/utils/areaCoverage';
import { toPublicExamQuestion, type ExamQuestion, type ExamQuestionPublic } from '@/features/exam/types/question';
import { HOME_AREA_IDS } from '@/shared/constants/areaInfo';
import ExamQuestionsSupabaseService from '@/services/supabase/ExamQuestionsSupabaseService';
import { getExamQuestionsByIdsForGrading } from '@/services/supabase/ExamQuestionsServerService';

const CACHE_REVALIDATE_SECONDS = 20 * 60;

function toPublicList(questions: ExamQuestion[]): ExamQuestionPublic[] {
  return questions.map(toPublicExamQuestion);
}

async function loadFromDbByRouteArea(
  routeArea: string,
  limit?: number,
  difficulty?: ExamQuestionDifficulty | null
): Promise<ExamQuestionPublic[]> {
  const fromDb = await ExamQuestionsSupabaseService.getByRouteArea(routeArea, limit, difficulty);
  return fromDb.length > 0 ? toPublicList(fromDb) : [];
}

async function loadFromDbForFullExam(): Promise<ExamQuestionPublic[]> {
  const fromDb = await ExamQuestionsSupabaseService.getByRouteAreas([...FULL_EXAM_ROUTE_AREAS]);
  return fromDb.length > 0 ? toPublicList(fromDb) : [];
}

const getCachedDbQuestionsByRouteArea = (
  routeArea: string,
  limit?: number,
  difficulty?: ExamQuestionDifficulty | null
) =>
  unstable_cache(
    () => loadFromDbByRouteArea(routeArea, limit, difficulty),
    ['exam-questions-area', routeArea, String(limit ?? 'all'), difficulty ?? 'all'],
    { revalidate: CACHE_REVALIDATE_SECONDS }
  );

const getCachedDbQuestionsForFullExam = unstable_cache(loadFromDbForFullExam, ['exam-questions-full-exam'], {
  revalidate: CACHE_REVALIDATE_SECONDS,
});

export async function fetchPublicQuestionsByRouteArea(
  routeArea: string,
  limit?: number,
  difficulty?: ExamQuestionDifficulty | null
): Promise<ExamQuestionPublic[]> {
  const fallback = getStaticQuestionsByRouteArea(routeArea);
  const filteredFallback =
    difficulty != null ? fallback.filter((question) => question.difficulty === difficulty) : fallback;
  const cappedFallback = limit != null && limit > 0 ? filteredFallback.slice(0, limit) : filteredFallback;

  try {
    const fromDb = await getCachedDbQuestionsByRouteArea(routeArea, limit, difficulty)();
    if (fromDb.length > 0) return fromDb;
  } catch (error) {
    console.warn('[examQuestionsServer] Supabase fallback for area', routeArea, error);
  }

  return toPublicList(cappedFallback);
}

function capFullExamQuestions(questions: ExamQuestionPublic[]): ExamQuestionPublic[] {
  return questions.slice(0, FULL_EXAM_MAX_QUESTIONS);
}

export async function fetchPublicQuestionsForFullExam(): Promise<ExamQuestionPublic[]> {
  const fallback = getStaticQuestionsForFullExam();

  try {
    const fromDb = await getCachedDbQuestionsForFullExam();
    if (fromDb.length > 0) return capFullExamQuestions(fromDb);
  } catch (error) {
    console.warn('[examQuestionsServer] Supabase fallback for full exam', error);
  }

  return capFullExamQuestions(toPublicList(fallback));
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

async function loadPublishedCoverageByArea(): Promise<Record<string, number>> {
  return ExamQuestionsSupabaseService.countPublishedByRouteAreas([...HOME_AREA_IDS]);
}

const getCachedPublishedCoverageByArea = unstable_cache(loadPublishedCoverageByArea, ['exam-questions-coverage'], {
  revalidate: CACHE_REVALIDATE_SECONDS,
});

/** Conteos live del banco publicado por área (sin fallback estático de marketing). */
export async function fetchPublishedCoverageByArea(): Promise<Record<string, number>> {
  try {
    return await getCachedPublishedCoverageByArea();
  } catch (error) {
    console.warn('[examQuestionsServer] Supabase coverage count failed', error);
    return zeroCoverageForAreas(HOME_AREA_IDS);
  }
}
