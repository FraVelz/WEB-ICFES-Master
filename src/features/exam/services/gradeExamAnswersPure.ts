import type { ExamQuestion } from '@/features/exam/types/question';
import { isAnswerCorrect } from '@/features/exam/utils/answerKey';

export type GradedExamAnswer = {
  questionId: string;
  correct: boolean;
  userAnswer: string;
  correctAnswer: string;
  explanation?: string;
  text: string;
  options: ExamQuestion['options'];
};

/** Pure grading — no DB. Used by examGradingServer and unit tests. */
export function gradeExamAnswersPure(
  questions: ExamQuestion[],
  answers: Record<string, string>
): GradedExamAnswer[] {
  return questions.map((question) => {
    const userAnswer = answers[question.id] ?? '';
    return {
      questionId: question.id,
      correct: isAnswerCorrect(userAnswer, question.correctAnswer, question.options),
      userAnswer,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      text: question.text,
      options: question.options,
    };
  });
}

export function summarizeGradedExam(results: Pick<GradedExamAnswer, 'correct'>[]): {
  correctCount: number;
  percentage: number;
  total: number;
} {
  const total = results.length;
  const correctCount = results.filter((r) => r.correct).length;
  const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  return { correctCount, percentage, total };
}
