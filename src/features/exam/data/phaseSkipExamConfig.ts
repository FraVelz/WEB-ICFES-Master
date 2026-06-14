import type { ExamConfig } from '@/features/exam/types';

/** Config fija del simulacro para saltar fase (sin pantalla de personalización). */
export function buildPhaseSkipExamConfig(totalQuestions: number): ExamConfig {
  return {
    numQuestions: Math.max(1, totalQuestions),
    useTimer: true,
    timePerQuestion: 2,
    showExplanations: true,
  };
}
