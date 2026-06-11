import { supabase } from '@/config/supabase';
import type { GradedExamAnswer } from '@/features/exam/services/examGradingServer';

async function getAuthHeaders(): Promise<HeadersInit> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  const session = (await supabase?.auth.getSession())?.data?.session;

  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`;
  }

  return headers;
}

export async function fetchGradedExamResults(answers: Record<string, string>): Promise<GradedExamAnswer[]> {
  const response = await fetch('/api/exam/grade/', {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify({ answers }),
  });

  const data = (await response.json()) as { results?: GradedExamAnswer[]; error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? 'No se pudo calificar el examen');
  }

  return data.results ?? [];
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
