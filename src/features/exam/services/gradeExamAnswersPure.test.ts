import { describe, expect, it } from 'vitest';

import type { ExamQuestion } from '@/features/exam/types/question';

import { gradeExamAnswersPure, summarizeGradedExam } from './gradeExamAnswersPure';

const questions: ExamQuestion[] = [
  {
    id: 'q1',
    text: '2+2?',
    options: [
      { id: 'a', text: '3', letter: 'A' },
      { id: 'b', text: '4', letter: 'B' },
    ],
    correctAnswer: 'b',
    explanation: '2+2=4',
  },
  {
    id: 'q2',
    text: 'Capital?',
    options: [
      { id: 'a', text: 'Bogotá', letter: 'A' },
      { id: 'b', text: 'Cali', letter: 'B' },
    ],
    correctAnswer: 'a',
  },
];

describe('gradeExamAnswersPure', () => {
  it('scores correct and incorrect answers with percentage', () => {
    const results = gradeExamAnswersPure(questions, { q1: 'b', q2: 'b' });

    expect(results).toHaveLength(2);
    expect(results[0]).toMatchObject({
      questionId: 'q1',
      correct: true,
      userAnswer: 'b',
      correctAnswer: 'b',
    });
    expect(results[1]).toMatchObject({
      questionId: 'q2',
      correct: false,
      userAnswer: 'b',
      correctAnswer: 'a',
    });

    expect(summarizeGradedExam(results)).toEqual({
      correctCount: 1,
      percentage: 50,
      total: 2,
    });
  });

  it('treats option letter and id as the same answer', () => {
    const results = gradeExamAnswersPure(questions, { q1: 'B', q2: 'A' });
    expect(results.every((r) => r.correct)).toBe(true);
    expect(summarizeGradedExam(results).percentage).toBe(100);
  });

  it('marks missing answers as incorrect', () => {
    const results = gradeExamAnswersPure(questions, { q1: 'b' });
    expect(results[1]?.correct).toBe(false);
    expect(results[1]?.userAnswer).toBe('');
    expect(summarizeGradedExam(results).correctCount).toBe(1);
  });
});
