import { supabase } from '@/config/supabase';
import type { GradedExamAnswer } from '@/features/exam/services/examGradingServer';
import type { ActivityAttemptType } from '@/services/exam/activityXpServer';

export type ExamGradeOptions = {
  awardActivity?: {
    attemptType: ActivityAttemptType;
    attemptId: number;
    /** Server-signed timer from POST /api/exam/timer — required for league XP. */
    timerToken?: string;
  };
};

export type ExamGradeResponse = {
  results: GradedExamAnswer[];
  activityXp?: { awarded: boolean; xp: number; points: number };
};

async function getAuthHeaders(): Promise<HeadersInit> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  const session = (await supabase?.auth.getSession())?.data?.session;

  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`;
  }

  return headers;
}

export async function fetchGradedExamResults(
  answers: Record<string, string>,
  options?: ExamGradeOptions
): Promise<ExamGradeResponse> {
  const response = await fetch('/api/exam/grade/', {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify({ answers, awardActivity: options?.awardActivity }),
  });

  const data = (await response.json()) as ExamGradeResponse & { error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? 'No se pudo calificar el examen');
  }

  return {
    results: data.results ?? [],
    activityXp: data.activityXp,
  };
}

export function gradedToExamQuestion(graded: GradedExamAnswer) {
  return {
    id: graded.questionId,
    text: graded.text,
    options: graded.options,
    correctAnswer: graded.correctAnswer,
    explanation: graded.explanation,
  };
}
