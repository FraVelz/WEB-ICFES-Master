import { getApiAuthHeaders } from '@/utils/apiClientAuth';
import type { LessonQuizGradeResult } from '@/features/learning/roadmap/lessonQuiz/quizTypes';
import type { NormalizedQuizQuestion } from '@/features/learning/roadmap/lessonQuiz/quizTypes';

export type BlockExamStartResponse = {
  checkpointId: string;
  areaId: string;
  blockId: string;
  blockTitle: string;
  passPercent: number;
  sessionToken: string;
  questions: NormalizedQuizQuestion[];
  totalQuestions: number;
};

export type BlockExamGradeResponse = {
  passed: boolean;
  score: number;
  allCorrect: boolean;
  correctCount: number;
  totalQuestions: number;
  results: LessonQuizGradeResult[];
  areaId: string;
  blockId: string;
  checkpointId: string;
  rewards?: { xp: number; coins: number; alreadyAwarded?: boolean };
};

export async function fetchBlockExamStart(checkpointId: string, lessonIds: string[]): Promise<BlockExamStartResponse> {
  const headers = await getApiAuthHeaders();
  if (!('Authorization' in (headers as Record<string, string>))) {
    throw new Error('Debes iniciar sesión para iniciar el examen');
  }

  const response = await fetch('/api/learning/block-exam/start/', {
    method: 'POST',
    headers,
    body: JSON.stringify({ checkpointId, lessonIds }),
  });

  const data = (await response.json()) as BlockExamStartResponse & { error?: string };
  if (!response.ok) {
    throw new Error(data.error ?? 'No se pudo iniciar el examen');
  }

  return data;
}

export async function fetchBlockExamGrade(
  sessionToken: string,
  answers: Record<string, string>
): Promise<BlockExamGradeResponse> {
  const headers = await getApiAuthHeaders();
  if (!('Authorization' in (headers as Record<string, string>))) {
    throw new Error('Debes iniciar sesión para calificar el examen');
  }

  const response = await fetch('/api/learning/block-exam/grade/', {
    method: 'POST',
    headers,
    body: JSON.stringify({ sessionToken, answers }),
  });

  const data = (await response.json()) as BlockExamGradeResponse & { error?: string };
  if (!response.ok) {
    throw new Error(data.error ?? 'No se pudo calificar el examen');
  }

  return data;
}
