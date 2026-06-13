import { describe, expect, it } from 'vitest';
import type { NormalizedQuizQuestion } from '@/features/learning/roadmap/lessonQuiz/quizTypes';
import {
  pickBlockExamQuestionCount,
  pickBlockExamQuestions,
} from '@/features/learning/roadmap/blockExam/blockExamServer';

function q(id: string): NormalizedQuizQuestion {
  return {
    id,
    question: `Pregunta ${id}`,
    options: [
      { id: 'a', text: 'A' },
      { id: 'b', text: 'B' },
    ],
    correctAnswer: 'a',
    explanation: '',
    difficulty: 'facil',
  };
}

describe('pickBlockExamQuestions', () => {
  it('elige entre 5 y 8 preguntas según el tamaño del bloque', () => {
    expect(pickBlockExamQuestionCount(3)).toBe(5);
    expect(pickBlockExamQuestionCount(10)).toBe(8);
    expect(pickBlockExamQuestionCount(6)).toBe(6);
  });

  it('toma como máximo una pregunta por lección', () => {
    const map = new Map<string, NormalizedQuizQuestion[]>([
      ['l1', [q('q1'), q('q1b')]],
      ['l2', [q('q2')]],
      ['l3', [q('q3')]],
    ]);

    const picked = pickBlockExamQuestions(map, ['l1', 'l2', 'l3']);
    const lessonSources = picked.map((question) => question.id.split('__')[0]);

    expect(picked.length).toBe(3);
    expect(new Set(lessonSources).size).toBe(3);
  });
});
