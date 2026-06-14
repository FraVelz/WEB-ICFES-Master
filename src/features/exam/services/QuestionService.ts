import type { ExamQuestionDifficulty } from '@/features/exam/data/phaseSkipDifficulty';
import type { ExamQuestionPublic } from '@/features/exam/types/question';
import { PRACTICE_AREA_QUESTIONS_FETCH_LIMIT } from '@/features/exam/constants/practiceQuestionLimits';
import { getApiAuthHeaders } from '@/utils/apiClientAuth';
import {
  readExamQuestionsSessionCache,
  writeExamQuestionsSessionCache,
} from '@/features/exam/services/examQuestionsSessionCache';

async function fetchPublicQuestions(params: URLSearchParams): Promise<ExamQuestionPublic[]> {
  const response = await fetch(`/api/exam/questions/?${params.toString()}`, {
    headers: await getApiAuthHeaders(),
    credentials: 'same-origin',
  });
  const data = (await response.json()) as { questions?: ExamQuestionPublic[]; error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? 'No se pudieron cargar las preguntas.');
  }

  return data.questions ?? [];
}

export async function fetchQuestionsByRouteArea(
  routeArea: string,
  limit = PRACTICE_AREA_QUESTIONS_FETCH_LIMIT,
  difficulty?: ExamQuestionDifficulty | null
): Promise<ExamQuestionPublic[]> {
  const cached = readExamQuestionsSessionCache(routeArea, limit, difficulty);
  if (cached) return cached;

  const params = new URLSearchParams({ area: routeArea, limit: String(limit) });
  if (difficulty) params.set('difficulty', difficulty);
  const questions = await fetchPublicQuestions(params);
  writeExamQuestionsSessionCache(routeArea, limit, questions, difficulty);
  return questions;
}

export async function fetchQuestionsForFullExam(): Promise<ExamQuestionPublic[]> {
  return fetchPublicQuestions(new URLSearchParams({ full: '1' }));
}
