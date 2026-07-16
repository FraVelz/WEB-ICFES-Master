import { describe, expect, it } from 'vitest';

import {
  canTransitionPracticeSession,
  shouldPersistPracticeSession,
  transitionPracticeSession,
  type PracticeSessionEvent,
  type PracticeSessionState,
} from './practiceSessionMachine';

describe('practiceSessionMachine', () => {
  it('starts from not_started into in_progress', () => {
    expect(transitionPracticeSession('not_started', 'START')).toBe('in_progress');
    expect(canTransitionPracticeSession('not_started', 'START')).toBe(true);
  });

  it('allows in_progress → submitted (finish/grade)', () => {
    expect(transitionPracticeSession('in_progress', 'SUBMIT')).toBe('submitted');
  });

  it('allows in_progress → abandoned (reset/exit)', () => {
    expect(transitionPracticeSession('in_progress', 'ABANDON')).toBe('abandoned');
  });

  it('returns terminal states to not_started via RESET', () => {
    expect(transitionPracticeSession('submitted', 'RESET')).toBe('not_started');
    expect(transitionPracticeSession('abandoned', 'RESET')).toBe('not_started');
  });

  it('allows abandoned → in_progress via START (new attempt)', () => {
    expect(transitionPracticeSession('abandoned', 'START')).toBe('in_progress');
  });

  it('rejects illegal transitions', () => {
    const illegal: Array<[PracticeSessionState, PracticeSessionEvent]> = [
      ['not_started', 'SUBMIT'],
      ['not_started', 'ABANDON'],
      ['submitted', 'START'],
      ['submitted', 'SUBMIT'],
      ['in_progress', 'START'],
      ['in_progress', 'RESET'],
    ];

    for (const [state, event] of illegal) {
      expect(canTransitionPracticeSession(state, event)).toBe(false);
      expect(() => transitionPracticeSession(state, event)).toThrow(/Invalid practice session transition/);
    }
  });

  it('only persists in_progress snapshots', () => {
    expect(shouldPersistPracticeSession('not_started')).toBe(false);
    expect(shouldPersistPracticeSession('in_progress')).toBe(true);
    expect(shouldPersistPracticeSession('submitted')).toBe(false);
    expect(shouldPersistPracticeSession('abandoned')).toBe(false);
  });

  it('covers happy path not_started → in_progress → submitted → not_started', () => {
    let state: PracticeSessionState = 'not_started';
    state = transitionPracticeSession(state, 'START');
    expect(state).toBe('in_progress');
    expect(shouldPersistPracticeSession(state)).toBe(true);
    state = transitionPracticeSession(state, 'SUBMIT');
    expect(state).toBe('submitted');
    expect(shouldPersistPracticeSession(state)).toBe(false);
    state = transitionPracticeSession(state, 'RESET');
    expect(state).toBe('not_started');
  });

  it('covers abandon path not_started → in_progress → abandoned → not_started', () => {
    let state: PracticeSessionState = 'not_started';
    state = transitionPracticeSession(state, 'START');
    state = transitionPracticeSession(state, 'ABANDON');
    expect(state).toBe('abandoned');
    state = transitionPracticeSession(state, 'RESET');
    expect(state).toBe('not_started');
  });
});
