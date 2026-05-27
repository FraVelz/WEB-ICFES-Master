/**
 * Public exam feature surface (pages, components, hooks, shared types).
 */
export type { ExamQuestion, QuestionOption, ExamConfig } from './types';

export { ExamConfigModal, AnswerSheet, ResultsAnalysis } from './components';

export { PracticePage, FullExamPage, ClasificatoriaPage } from './pages';

export { useExam } from './hooks';
