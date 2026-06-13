import type { LessonQuizGradeResult, NormalizedQuizQuestion } from './quizTypes';

export function gradeLessonQuizAnswersPure(
  questions: NormalizedQuizQuestion[],
  answers: Record<string, string>
): { results: LessonQuizGradeResult[]; allCorrect: boolean } {
  const results = questions
    .filter((q) => answers[q.id] != null)
    .map((question) => {
      const userAnswer = answers[question.id] ?? '';
      return {
        questionId: question.id,
        correct: userAnswer === question.correctAnswer,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
      };
    });

  const allCorrect = questions.length > 0 && questions.every((q) => answers[q.id] === q.correctAnswer);

  return { results, allCorrect };
}
