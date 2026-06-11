import { secondsToDisplayMinutes } from '@/services/studyTime/studyTimeUtils';
import { loadStudyTimeState } from './studyTimeStorage';
import { currentSessionSeconds, isSessionActive } from './studyTimeSession';
import {
  MARATHON_TARGET_MINUTES,
  STUDY_TIME_META_KEY,
  type StudyTimeRemoteMeta,
  type StudyTimeStats,
} from './studyTimeTypes';

export { STUDY_TIME_META_KEY };

export function getStudyTimeStats(userId: string): StudyTimeStats {
  const state = loadStudyTimeState(userId);
  const now = Date.now();
  const activeSessionSeconds = isSessionActive(state, now) ? currentSessionSeconds(state, now) : 0;

  return {
    totalMinutes: secondsToDisplayMinutes(state.totalSeconds + activeSessionSeconds),
    longestSessionMinutes: Math.min(
      MARATHON_TARGET_MINUTES,
      secondsToDisplayMinutes(Math.max(state.longestSessionSeconds, activeSessionSeconds))
    ),
    currentSessionMinutes: secondsToDisplayMinutes(activeSessionSeconds),
  };
}

export function readStudyTimeRemoteMeta(rawAchievements: unknown): StudyTimeRemoteMeta {
  if (typeof rawAchievements !== 'object' || rawAchievements === null || Array.isArray(rawAchievements)) {
    return { totalMinutes: 0, longestSessionMinutes: 0 };
  }

  const meta = (rawAchievements as Record<string, unknown>)[STUDY_TIME_META_KEY];
  if (typeof meta !== 'object' || meta === null || Array.isArray(meta)) {
    return { totalMinutes: 0, longestSessionMinutes: 0 };
  }

  return {
    totalMinutes: Number((meta as StudyTimeRemoteMeta).totalMinutes ?? 0),
    longestSessionMinutes: Number((meta as StudyTimeRemoteMeta).longestSessionMinutes ?? 0),
  };
}
