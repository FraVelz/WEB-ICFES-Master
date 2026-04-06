/**
 * Public exam feature surface (pages, components, hooks, shared types).
 */
export type { ExamQuestion, QuestionOption, ExamConfig, AreaInfo } from './types';

export {
  ExamConfigModal,
  AnswerSheet,
  ResultsAnalysis,
  QuestionPanel,
} from './components';

export { PracticePage, FullExamPage, ClasificatoriaPage } from './pages';

export { useExam, useQuizLogic } from './hooks';
