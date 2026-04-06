/**
 * API pública del feature exam: páginas, componentes, hooks y tipos usados fuera de `features/exam`.
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
