export type { ExamQuestion, QuestionOption } from '@/shared/types/question';

export interface ExamConfig {
  numQuestions: number;
  timePerQuestion?: number;
  useTimer?: boolean;
  showExplanations?: boolean;
}

export interface AreaInfo {
  name: string;
  color: string;
  icon?: string;
}
