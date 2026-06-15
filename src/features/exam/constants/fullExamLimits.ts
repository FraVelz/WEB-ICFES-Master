/** Máximo de preguntas del simulacro integral (todas las áreas). */
export const FULL_EXAM_MAX_QUESTIONS = 278;

export function capFullExamQuestionCount(poolSize: number): number {
  if (!Number.isFinite(poolSize) || poolSize <= 0) return 0;
  return Math.min(poolSize, FULL_EXAM_MAX_QUESTIONS);
}
