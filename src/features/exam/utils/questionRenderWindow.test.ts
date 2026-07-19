import { describe, expect, it } from 'vitest';

import { PRACTICE_AREA_QUESTIONS_FETCH_LIMIT } from '@/features/exam/constants/practiceQuestionLimits';
import { FULL_EXAM_MAX_QUESTIONS } from '@/features/exam/constants/fullExamLimits';

import {
  assertPracticeFetchBelowFullSimulacro,
  getQuestionRenderWindow,
} from './questionRenderWindow';

describe('getQuestionRenderWindow', () => {
  it('renders current and prefetches the next question', () => {
    expect(getQuestionRenderWindow(0, 10)).toEqual({
      start: 0,
      end: 2,
      indices: [0, 1],
    });
    expect(getQuestionRenderWindow(4, 10)).toEqual({
      start: 4,
      end: 6,
      indices: [4, 5],
    });
  });

  it('clamps at the end of the list', () => {
    expect(getQuestionRenderWindow(9, 10)).toEqual({
      start: 9,
      end: 10,
      indices: [9],
    });
  });

  it('handles empty sessions', () => {
    expect(getQuestionRenderWindow(0, 0)).toEqual({ start: 0, end: 0, indices: [] });
  });
});

describe('practice fetch budget', () => {
  it('keeps practice area fetch below a 200Q client dump', () => {
    expect(assertPracticeFetchBelowFullSimulacro(PRACTICE_AREA_QUESTIONS_FETCH_LIMIT)).toBe(true);
    expect(PRACTICE_AREA_QUESTIONS_FETCH_LIMIT).toBeLessThan(200);
    expect(PRACTICE_AREA_QUESTIONS_FETCH_LIMIT).toBeLessThanOrEqual(50);
  });

  it('documents full exam as a separate capped pool (beta, not star mode)', () => {
    expect(FULL_EXAM_MAX_QUESTIONS).toBeGreaterThan(200);
  });
});
