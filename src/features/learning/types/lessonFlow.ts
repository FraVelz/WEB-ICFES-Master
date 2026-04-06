export type StepType = 'content' | 'quiz' | 'math_input' | 'resource';

export type ContentStepData = {
  title: string;
  text: string;
  math?: string;
};

export type QuizStepData = {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  mathExplanation?: string;
};

export type MathInputStepData = {
  question: string;
  answer: string;
};

export type ResourceFormat = 'pdf' | 'link' | 'video';

export type ResourceStepData = {
  title: string;
  url: string;
  format: ResourceFormat;
};

export type LessonStepRow = {
  id: string;
  lesson_id: string;
  type: StepType;
  order_index: number;
  data: ContentStepData | QuizStepData | MathInputStepData | ResourceStepData;
};

export type LessonSummary = {
  id: string;
  title: string;
};
