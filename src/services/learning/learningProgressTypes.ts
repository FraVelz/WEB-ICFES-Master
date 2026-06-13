import type { BlockExamPassRecord } from '@/services/persistence/blockExamPersistence';
import type { PhaseSkipRecord } from '@/services/persistence/phaseSkipPersistence';

export const LEARNING_PROGRESS_META_KEY = '_learningProgress';
export const LEARNING_PROGRESS_UPDATED_EVENT = 'icfes_learning_progress_updated';

export type LearningProgressSnapshot = {
  completedLessons: string[];
  phaseSkips: PhaseSkipRecord[];
  blockExamPasses: BlockExamPassRecord[];
};

export const EMPTY_LEARNING_PROGRESS: LearningProgressSnapshot = {
  completedLessons: [],
  phaseSkips: [],
  blockExamPasses: [],
};
