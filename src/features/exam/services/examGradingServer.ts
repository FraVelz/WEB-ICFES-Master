import { FULL_EXAM_ROUTE_AREAS } from '@/features/exam/data/examAreas';
import { loadQuestionsByIdsForGrading } from '@/features/exam/services/examQuestionsServer';
import { gradeExamAnswersPure, type GradedExamAnswer } from '@/features/exam/services/gradeExamAnswersPure';

export type { GradedExamAnswer };

export async function gradeExamAnswers(answers: Record<string, string>): Promise<GradedExamAnswer[]> {
  const ids = Object.keys(answers);
  const questions = await loadQuestionsByIdsForGrading(ids);
  return gradeExamAnswersPure(questions, answers);
}

async function gradeFullExamPool(answers: Record<string, string>): Promise<GradedExamAnswer[]> {
  return gradeExamAnswers(answers);
}

const FULL_EXAM_AREA_IDS = FULL_EXAM_ROUTE_AREAS;
