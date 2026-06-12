import type { QuestionOption } from '@/features/exam/types/question';

export function findQuestionOption(
  options: QuestionOption[],
  key: string | undefined | null
): QuestionOption | undefined {
  if (!key) return undefined;
  return options.find((option) => option.id === key || option.letter === key);
}

/** Normaliza id de opción (a, b…) aunque la UI envíe la letra (A, B…). */
export function normalizeAnswerKey(answer: string, options?: QuestionOption[]): string {
  if (!answer) return answer;
  const match = options ? findQuestionOption(options, answer) : undefined;
  if (match) return match.id;
  return answer.toLowerCase();
}

export function isAnswerCorrect(userAnswer: string, correctAnswer: string, options?: QuestionOption[]): boolean {
  if (!userAnswer || !correctAnswer) return userAnswer === correctAnswer;
  return normalizeAnswerKey(userAnswer, options) === normalizeAnswerKey(correctAnswer, options);
}

export function formatAnswerLabel(key: string, options: QuestionOption[]): string {
  const option = findQuestionOption(options, key);
  return option?.letter ?? key.toUpperCase();
}
