import type { GradedExamAnswer } from '@/features/exam/services/examGradingServer';

/** Demo sessions may grade attempts but must not receive answer keys or explanations. */
export function sanitizeGradedResultsForDemo(
  results: GradedExamAnswer[]
): Omit<GradedExamAnswer, 'correctAnswer' | 'explanation'>[] {
  return results.map(({ correctAnswer: _ca, explanation: _ex, ...rest }) => rest);
}
