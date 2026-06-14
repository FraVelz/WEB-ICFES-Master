import type { NormalizedQuizQuestion } from '@/features/learning/roadmap/lessonQuiz/quizTypes';
import { PHASE_SKIP_MIN_QUESTIONS } from './phaseSkipConstants';

export class InsufficientPhaseSkipQuestionsError extends Error {
  readonly code = 'INSUFFICIENT_QUESTIONS' as const;

  constructor(
    readonly available: number,
    readonly required = PHASE_SKIP_MIN_QUESTIONS
  ) {
    super(`Se necesitan al menos ${required} preguntas en esta fase (hay ${available})`);
    this.name = 'InsufficientPhaseSkipQuestionsError';
  }
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function countPhaseSkipPoolQuestions(questionsByLesson: Map<string, NormalizedQuizQuestion[]>): number {
  let total = 0;
  for (const questions of questionsByLesson.values()) {
    total += questions.length;
  }
  return total;
}

export function pickPhaseSkipQuestions(
  questionsByLesson: Map<string, NormalizedQuizQuestion[]>,
  lessonIds: string[],
  targetCount = PHASE_SKIP_MIN_QUESTIONS
): NormalizedQuizQuestion[] {
  const allCandidates: NormalizedQuizQuestion[] = [];
  for (const lessonId of lessonIds) {
    const pool = questionsByLesson.get(lessonId) ?? [];
    for (const question of pool) {
      allCandidates.push({
        ...question,
        id: `${lessonId}__${question.id}`,
      });
    }
  }

  if (allCandidates.length < targetCount) {
    throw new InsufficientPhaseSkipQuestionsError(allCandidates.length, targetCount);
  }

  const shuffledLessonIds = shuffle(lessonIds.filter((lessonId) => (questionsByLesson.get(lessonId)?.length ?? 0) > 0));
  const picked: NormalizedQuizQuestion[] = [];
  const usedIds = new Set<string>();

  for (const lessonId of shuffledLessonIds) {
    if (picked.length >= targetCount) break;
    const pool = questionsByLesson.get(lessonId) ?? [];
    if (pool.length === 0) continue;
    const question = pool[Math.floor(Math.random() * pool.length)];
    const compositeId = `${lessonId}__${question.id}`;
    if (usedIds.has(compositeId)) continue;
    usedIds.add(compositeId);
    picked.push({ ...question, id: compositeId });
  }

  if (picked.length < targetCount) {
    const remaining = shuffle(allCandidates.filter((candidate) => !usedIds.has(candidate.id)));
    for (const question of remaining) {
      if (picked.length >= targetCount) break;
      picked.push(question);
      usedIds.add(question.id);
    }
  }

  return shuffle(picked);
}
