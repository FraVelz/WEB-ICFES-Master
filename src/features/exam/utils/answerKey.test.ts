import { describe, expect, it } from 'vitest';
import { findQuestionOption, formatAnswerLabel, isAnswerCorrect } from './answerKey';
import type { QuestionOption } from '@/features/exam/types/question';

const options: QuestionOption[] = [
  { id: 'a', text: '$60.000', letter: 'A' },
  { id: 'b', text: '$55.000', letter: 'B' },
];

describe('answerKey', () => {
  it('treats letter and id as the same answer', () => {
    expect(isAnswerCorrect('A', 'a', options)).toBe(true);
    expect(isAnswerCorrect('B', 'a', options)).toBe(false);
  });

  it('finds options by id or letter', () => {
    expect(findQuestionOption(options, 'A')?.text).toBe('$60.000');
    expect(findQuestionOption(options, 'a')?.text).toBe('$60.000');
  });

  it('formats display label from either key', () => {
    expect(formatAnswerLabel('a', options)).toBe('A');
    expect(formatAnswerLabel('A', options)).toBe('A');
  });
});
