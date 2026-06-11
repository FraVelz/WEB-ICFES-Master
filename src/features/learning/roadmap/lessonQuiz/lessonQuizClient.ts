import { supabase } from '@/config/supabase';
import type { LessonQuizGradeResult } from './lessonQuizGradingServer';

async function getAuthHeaders(): Promise<HeadersInit> {
  const session = (await supabase?.auth.getSession())?.data?.session;
  if (!session?.access_token) {
    throw new Error('Debes iniciar sesión para completar el quiz');
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.access_token}`,
  };
}

export async function fetchLessonQuizGrade(
  lessonId: string,
  answers: Record<string, string>,
  options?: { awardRewards?: boolean; lessonXp?: number; lessonCoins?: number }
): Promise<{
  results: LessonQuizGradeResult[];
  allCorrect: boolean;
  rewards?: { xp: number; coins: number };
}> {
  const response = await fetch('/api/learning/quiz/grade/', {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify({
      lessonId,
      answers,
      awardRewards: options?.awardRewards ?? false,
      lessonXp: options?.lessonXp,
      lessonCoins: options?.lessonCoins,
    }),
  });

  const data = (await response.json()) as {
    results?: LessonQuizGradeResult[];
    allCorrect?: boolean;
    rewards?: { xp: number; coins: number };
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
