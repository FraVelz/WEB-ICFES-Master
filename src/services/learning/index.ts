export {
  LEARNING_PROGRESS_META_KEY,
  LEARNING_PROGRESS_UPDATED_EVENT,
  type LearningProgressSnapshot,
} from './learningProgressTypes';

export {
  ensureLearningProgressSynced,
  getCompletedLessonsLocal,
  invalidateLearningProgressSync,
  notifyLearningProgressUpdated,
  pushLearningProgressToRemote,
  syncLearningProgressWithRemote,
} from './learningProgressService';

export {
  readLearningProgressRemoteMeta,
  getLocalLearningProgress,
} from './learningProgressLocal';

export { mergeLearningProgress, skippedSectionIdsByAreaFromRecords } from './learningProgressMerge';
