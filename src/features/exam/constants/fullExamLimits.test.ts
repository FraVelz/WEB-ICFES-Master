import { describe, expect, it } from 'vitest';
import { FULL_EXAM_MAX_QUESTIONS, capFullExamQuestionCount } from './fullExamLimits';

describe('fullExamLimits', () => {
  it('define 278 como tope del simulacro integral', () => {
    expect(FULL_EXAM_MAX_QUESTIONS).toBe(278);
  });

  it('limita el conteo al tope cuando el banco es mayor', () => {
    expect(capFullExamQuestionCount(328)).toBe(278);
    expect(capFullExamQuestionCount(3000)).toBe(278);
  });

  it('no sube el conteo si el banco es menor al tope', () => {
    expect(capFullExamQuestionCount(120)).toBe(120);
    expect(capFullExamQuestionCount(0)).toBe(0);
  });
});
