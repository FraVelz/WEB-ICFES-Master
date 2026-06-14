import { getApiAuthHeaders } from '@/utils/apiClientAuth';
import type { LessonQuizGradeResult, NormalizedQuizQuestion } from '@/features/learning/roadmap/lessonQuiz/quizTypes';

export type PhaseSkipStartResponse = {
  areaId: string;
  sectionId: string;
  phaseTitle: string;
  passPercent: number;
  sessionToken: string;
  questions: NormalizedQuizQuestion[];
  totalQuestions: number;
  minRequired: number;
};

export type PhaseSkipGradeResponse = {
  passed: boolean;
  score: number;
  allCorrect: boolean;
  correctCount: number;
  totalQuestions: number;
  results: LessonQuizGradeResult[];
  areaId: string;
  sectionId: string;
  lessonIds: string[];
  lessonsCompletedCount: number;
  rewards?: { xp: number; coins: number; alreadyAwarded?: boolean };
};

export type PhaseSkipAvailabilityResponse = {
  totalQuestions: number;
  lessonCount: number;
  lessonsWithQuiz: number;
  canStart: boolean;
  minRequired: number;
};

export async function fetchPhaseSkipAvailability(lessonIds: string[]): Promise<PhaseSkipAvailabilityResponse> {
  const headers = await getApiAuthHeaders();
  if (!('Authorization' in (headers as Record<string, string>))) {
    throw new Error('Debes iniciar sesión para consultar disponibilidad');
  }

  const response = await fetch('/api/learning/phase-skip/availability/', {
    method: 'POST',
    headers,
    body: JSON.stringify({ lessonIds }),
  });

  const data = (await response.json()) as PhaseSkipAvailabilityResponse & { error?: string };
  if (!response.ok) {
    throw new Error(data.error ?? 'No se pudo consultar disponibilidad');
  }

  return data;
}

export async function fetchPhaseSkipStart(
  areaId: string,
  sectionId: string,
  lessonIds: string[]
): Promise<PhaseSkipStartResponse> {
  const headers = await getApiAuthHeaders();
  if (!('Authorization' in (headers as Record<string, string>))) {
    throw new Error('Debes iniciar sesión para iniciar el simulacro');
  }

  const response = await fetch('/api/learning/phase-skip/start/', {
    method: 'POST',
    headers,
    body: JSON.stringify({ areaId, sectionId, lessonIds }),
  });

  const data = (await response.json()) as PhaseSkipStartResponse & { error?: string; code?: string };
  if (!response.ok) {
    throw new Error(data.error ?? 'No se pudo iniciar el simulacro');
  }

  return data;
}

export async function fetchPhaseSkipGrade(
  sessionToken: string,
  answers: Record<string, string>
): Promise<PhaseSkipGradeResponse> {
  const headers = await getApiAuthHeaders();
  if (!('Authorization' in (headers as Record<string, string>))) {
    throw new Error('Debes iniciar sesión para calificar el simulacro');
  }

  const response = await fetch('/api/learning/phase-skip/grade/', {
    method: 'POST',
    headers,
    body: JSON.stringify({ sessionToken, answers }),
  });

  const data = (await response.json()) as PhaseSkipGradeResponse & { error?: string };
  if (!response.ok) {
    throw new Error(data.error ?? 'No se pudo calificar el simulacro');
  }

  return data;
}
