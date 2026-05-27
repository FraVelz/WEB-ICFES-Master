export type { ExamQuestion, QuestionOption } from '@/features/exam/types/question';

export interface ExamConfig {
  numQuestions: number;
  timePerQuestion?: number;
  useTimer?: boolean;
  showExplanations?: boolean;
}
