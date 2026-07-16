/**
 * Mid-practice session autosave (práctica por área).
 *
 * Explicit session states (see practiceSessionMachine.ts):
 * - `not_started` — no durable snapshot (config modal / idle)
 * - `in_progress` — active attempt; answers + meta persisted; restored on refresh
 * - `submitted` — user finished / grading started; snapshot cleared
 * - `abandoned` — user reset / left intentionally; snapshot cleared
 *
 * Only `in_progress` is stored. Terminal states clear the key.
 * Full simulacro resume is out of scope (D1).
 */
import type { ExamQuestionDifficulty } from '@/features/exam/data/phaseSkipDifficulty';
import type { ExamConfig } from '@/features/exam/types';
import type { ExamQuestionPublic } from '@/features/exam/types/question';
import type { PracticeSessionState } from '@/features/exam/utils/practiceSessionMachine';
import { shouldPersistPracticeSession } from '@/features/exam/utils/practiceSessionMachine';

export type { PracticeSessionState };

export const PRACTICE_SESSION_STORAGE_PREFIX = 'icfes_practice_session_v1';

export type PracticeSessionSnapshot = {
  version: 1;
  state: 'in_progress';
  areaSlug: string;
  difficulty: ExamQuestionDifficulty | null;
  examConfig: ExamConfig;
  questions: ExamQuestionPublic[];
  answers: Record<string, string>;
  /**
   * Absolute end time (ms) when timer is active; null if no timer.
   * Source of truth for remaining time — client renders `endsAt - now`, not a decrementing counter.
   * Prefer the value from a server-signed `timerToken` (B3-1), not a raw client Date.now().
   */
  timerEndsAt: number | null;
  /** HMAC timer/start token from POST /api/exam/timer — required for league XP (B3-2). */
  timerToken?: string | null;
  updatedAt: string;
};

export function practiceSessionStorageKey(
  areaSlug: string,
  difficulty: ExamQuestionDifficulty | null | undefined
): string {
  return `${PRACTICE_SESSION_STORAGE_PREFIX}:${areaSlug}:${difficulty ?? 'all'}`;
}

export function computeTimeRemainingFromEndsAt(
  timerEndsAt: number | null,
  now: number = Date.now()
): number | null {
  if (timerEndsAt == null) return null;
  return Math.max(0, Math.ceil((timerEndsAt - now) / 1000));
}

function isValidConfig(config: unknown): config is ExamConfig {
  if (!config || typeof config !== 'object') return false;
  const c = config as ExamConfig;
  return typeof c.numQuestions === 'number' && c.numQuestions >= 1;
}

function isValidSnapshot(parsed: unknown): parsed is PracticeSessionSnapshot {
  if (!parsed || typeof parsed !== 'object') return false;
  const s = parsed as PracticeSessionSnapshot;
  if (s.version !== 1 || s.state !== 'in_progress') return false;
  if (typeof s.areaSlug !== 'string' || !s.areaSlug) return false;
  if (!isValidConfig(s.examConfig)) return false;
  if (!Array.isArray(s.questions) || s.questions.length === 0) return false;
  if (!s.answers || typeof s.answers !== 'object') return false;
  if (s.timerEndsAt != null && typeof s.timerEndsAt !== 'number') return false;
  if (s.timerToken != null && typeof s.timerToken !== 'string') return false;
  return true;
}

export function loadPracticeSession(
  areaSlug: string,
  difficulty: ExamQuestionDifficulty | null | undefined
): PracticeSessionSnapshot | null {
  if (typeof window === 'undefined' || !areaSlug) return null;
  try {
    const raw = localStorage.getItem(practiceSessionStorageKey(areaSlug, difficulty));
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isValidSnapshot(parsed)) {
      clearPracticeSession(areaSlug, difficulty);
      return null;
    }
    if (parsed.areaSlug !== areaSlug) return null;
    const expectedDifficulty = difficulty ?? null;
    if ((parsed.difficulty ?? null) !== expectedDifficulty) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Load durable snapshot and derive timer remaining (post-reload hydrate). */
export function hydratePracticeSessionFromStorage(
  areaSlug: string,
  difficulty: ExamQuestionDifficulty | null | undefined,
  now: number = Date.now()
): (PracticeSessionSnapshot & { timeRemaining: number | null }) | null {
  const snapshot = loadPracticeSession(areaSlug, difficulty);
  if (!snapshot) return null;
  return {
    ...snapshot,
    timeRemaining: computeTimeRemainingFromEndsAt(snapshot.timerEndsAt, now),
  };
}

export function savePracticeSession(snapshot: Omit<PracticeSessionSnapshot, 'version' | 'updatedAt'>): void {
  if (typeof window === 'undefined') return;
  if (!shouldPersistPracticeSession(snapshot.state)) return;
  try {
    const payload: PracticeSessionSnapshot = {
      ...snapshot,
      version: 1,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(
      practiceSessionStorageKey(snapshot.areaSlug, snapshot.difficulty),
      JSON.stringify(payload)
    );
  } catch {
    // quota / private mode — ignore
  }
}

export function clearPracticeSession(
  areaSlug: string,
  difficulty: ExamQuestionDifficulty | null | undefined
): void {
  if (typeof window === 'undefined' || !areaSlug) return;
  localStorage.removeItem(practiceSessionStorageKey(areaSlug, difficulty));
}

/** Clears all practice-session keys (logout / wipe local data). */
export function clearAllPracticeSessions(): void {
  if (typeof window === 'undefined') return;
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key?.startsWith(`${PRACTICE_SESSION_STORAGE_PREFIX}:`)) {
      localStorage.removeItem(key);
    }
  }
}
