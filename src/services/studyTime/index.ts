export {
  finalizeStudyTimeSession,
  getStudyTimeStats,
  loadStudyTimeState,
  mergeDemoStudyTimeIntoUser,
  mergeStudyTimeStates,
  processStudyTimeActivity,
  readStudyTimeRemoteMeta,
  resetStudyTimeActivityThrottleForTests,
  resolveStudyTimeUserId,
  MARATHON_TARGET_MINUTES,
  STUDY_TIME_META_KEY,
  STUDY_TIME_UPDATED_EVENT,
} from './studyTimeService';
export type { StudyTimeRemoteMeta, StudyTimeState, StudyTimeStats } from './studyTimeService';
export { formatStudyTime } from './studyTimeUtils';
export { isStudyPathname } from './isStudyPathname';
