import type { NormalizedQuizQuestion } from '@/features/learning/roadmap/lessonQuiz/quizTypes';
import type { ExamQuestion, ExamQuestionPublic } from '@/features/exam/types/question';

export function quizQuestionToExamPublic(question: NormalizedQuizQuestion): ExamQuestionPublic {
  return {
    id: question.id,
    text: question.question,
    options: question.options.map((option) => ({
      id: option.id,
      text: option.text,
    })),
    difficulty: question.difficulty,
  };
}

export function gradedQuizToExamQuestion(
  question: NormalizedQuizQuestion,
  result: { correctAnswer: string; explanation: string }
): ExamQuestion {
  return {
    id: question.id,
    text: question.question,
    options: question.options.map((option) => ({
      id: option.id,
      text: option.text,
    })),
    correctAnswer: result.correctAnswer,
    explanation: result.explanation,
    difficulty: question.difficulty,
    showExplanations: true,
  };
}
