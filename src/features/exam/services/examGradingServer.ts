import { FULL_EXAM_ROUTE_AREAS } from '@/features/exam/data/examAreas';
import type { ExamQuestion } from '@/features/exam/types/question';
import { loadQuestionsByIdsForGrading } from '@/features/exam/services/examQuestionsServer';

export type GradedExamAnswer = {
  questionId: string;
  correct: boolean;
  userAnswer: string;
  correctAnswer: string;
  explanation?: string;
  text: string;
  options: ExamQuestion['options'];
};

export async function gradeExamAnswers(answers: Record<string, string>): Promise<GradedExamAnswer[]> {
  const ids = Object.keys(answers);
  const questions = await loadQuestionsByIdsForGrading(ids);

  return questions.map((question) => {
    const userAnswer = answers[question.id] ?? '';
    return {
      questionId: question.id,
      correct: userAnswer === question.correctAnswer,
      userAnswer,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      text: question.text,
      options: question.options,
    };
  });
}

export async function gradeFullExamPool(answers: Record<string, string>): Promise<GradedExamAnswer[]> {
  return gradeExamAnswers(answers);
}

export const FULL_EXAM_AREA_IDS = FULL_EXAM_ROUTE_AREAS;
