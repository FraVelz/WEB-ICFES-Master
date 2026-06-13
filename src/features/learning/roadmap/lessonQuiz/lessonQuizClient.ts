import type { LessonQuizGradeResult } from './quizTypes';
import { getApiAuthHeaders } from '@/utils/apiClientAuth';

export async function fetchLessonQuizGrade(
  lessonId: string,
  answers: Record<string, string>,
  options?: { awardRewards?: boolean }
): Promise<{
  results: LessonQuizGradeResult[];
  allCorrect: boolean;
  rewards?: { xp: number; coins: number; alreadyAwarded?: boolean };
}> {
  const headers = await getApiAuthHeaders();
  if (!('Authorization' in (headers as Record<string, string>))) {
    throw new Error('Debes iniciar sesión para completar el quiz');
  }

  const response = await fetch('/api/learning/quiz/grade/', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      lessonId,
      answers,
      awardRewards: options?.awardRewards ?? false,
    }),
  });

  const data = (await response.json()) as {
    results?: LessonQuizGradeResult[];
    allCorrect?: boolean;
    rewards?: { xp: number; coins: number; alreadyAwarded?: boolean };
    error?: string;
  };

  if (!response.ok) {
    throw new Error(data.error ?? 'No se pudo calificar el quiz');
  }

  return {
    results: data.results ?? [],
    allCorrect: data.allCorrect ?? false,
    rewards: data.rewards,
  };
}
