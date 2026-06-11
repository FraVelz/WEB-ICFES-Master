export const STUDY_TIME_UPDATED_EVENT = 'icfes-study-time-updated';
export const STUDY_TIME_META_KEY = '_studyTime';
export const MARATHON_TARGET_MINUTES = 120;

export const IDLE_MS = 5 * 60 * 1000;
export const ACTIVITY_THROTTLE_MS = 10_000;

export interface StudyTimeState {
  totalSeconds: number;
  longestSessionSeconds: number;
  sessionStartedAt: number | null;
  lastActivityAt: number | null;
}

export interface StudyTimeStats {
  totalMinutes: number;
  longestSessionMinutes: number;
  currentSessionMinutes: number;
}

export interface StudyTimeRemoteMeta {
  totalMinutes: number;
  longestSessionMinutes: number;
}
