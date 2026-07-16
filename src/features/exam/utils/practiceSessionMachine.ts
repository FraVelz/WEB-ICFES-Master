/**
 * Explicit practice-session state machine (star mode: práctica por área).
 *
 * States mirror docs/domain: not_started → in_progress → submitted | abandoned.
 * Full simulacro resume is out of scope (D1).
 */
export type PracticeSessionState = 'not_started' | 'in_progress' | 'submitted' | 'abandoned';

export type PracticeSessionEvent = 'START' | 'SUBMIT' | 'ABANDON' | 'RESET';

const TRANSITIONS: Record<PracticeSessionState, Partial<Record<PracticeSessionEvent, PracticeSessionState>>> = {
  not_started: {
    START: 'in_progress',
  },
  in_progress: {
    SUBMIT: 'submitted',
    ABANDON: 'abandoned',
  },
  submitted: {
    RESET: 'not_started',
  },
  abandoned: {
    RESET: 'not_started',
    START: 'in_progress',
  },
};

export function canTransitionPracticeSession(
  state: PracticeSessionState,
  event: PracticeSessionEvent
): boolean {
  return TRANSITIONS[state][event] != null;
}

export function transitionPracticeSession(
  state: PracticeSessionState,
  event: PracticeSessionEvent
): PracticeSessionState {
  const next = TRANSITIONS[state][event];
  if (!next) {
    throw new Error(`Invalid practice session transition: ${state} + ${event}`);
  }
  return next;
}

/** Whether durable localStorage snapshot should exist for this state. */
export function shouldPersistPracticeSession(state: PracticeSessionState): boolean {
  return state === 'in_progress';
}
