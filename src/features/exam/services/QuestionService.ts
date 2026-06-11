import type { ExamQuestionPublic } from '@/features/exam/types/question';

async function fetchPublicQuestions(params: URLSearchParams): Promise<ExamQuestionPublic[]> {
  const response = await fetch(`/api/exam/questions/?${params.toString()}`);
  const data = (await response.json()) as { questions?: ExamQuestionPublic[]; error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? 'No se pudieron cargar las preguntas.');
  }

  return data.questions ?? [];
}

export async function fetchQuestionsByRouteArea(routeArea: string): Promise<ExamQuestionPublic[]> {
  return fetchPublicQuestions(new URLSearchParams({ area: routeArea }));
}

export async function fetchQuestionsForFullExam(): Promise<ExamQuestionPublic[]> {
  return fetchPublicQuestions(new URLSearchParams({ full: '1' }));
}
