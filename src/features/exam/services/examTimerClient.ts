import { supabase } from '@/config/supabase';

export type ExamTimerIssue = {
  timerToken: string;
  startedAt: number;
  endsAt: number | null;
  questionCount: number;
  attemptType: 'practice' | 'full-exam';
};

async function getAuthHeaders(): Promise<HeadersInit> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  const session = (await supabase?.auth.getSession())?.data?.session;

  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`;
  }

  return headers;
}

/** Ask the server for a signed wall-clock timer (not client Date.now() alone). */
export async function fetchSignedExamTimer(input: {
  durationSec: number | null;
  questionCount: number;
  attemptType: 'practice' | 'full-exam';
}): Promise<ExamTimerIssue> {
  const response = await fetch('/api/exam/timer/', {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(input),
  });

  const data = (await response.json()) as ExamTimerIssue & { error?: string };
  if (!response.ok) {
    throw new Error(data.error ?? 'No se pudo emitir el timer firmado');
  }

  if (typeof data.timerToken !== 'string' || typeof data.startedAt !== 'number') {
    throw new Error('Respuesta de timer inválida');
  }

  return {
    timerToken: data.timerToken,
    startedAt: data.startedAt,
    endsAt: data.endsAt ?? null,
    questionCount: data.questionCount,
    attemptType: data.attemptType,
  };
}
