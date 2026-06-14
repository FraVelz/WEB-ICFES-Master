import { describe, expect, it } from 'vitest';
import type { NormalizedQuizQuestion } from '@/features/learning/roadmap/lessonQuiz/quizTypes';
import {
  countPhaseSkipPoolQuestions,
  InsufficientPhaseSkipQuestionsError,
  pickPhaseSkipQuestions,
} from './phaseSkipQuestionPicker';
import { PHASE_SKIP_MIN_QUESTIONS } from './phaseSkipConstants';

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

function buildPool(lessonCount: number, questionsPerLesson: number): Map<string, NormalizedQuizQuestion[]> {
  const map = new Map<string, NormalizedQuizQuestion[]>();
  for (let i = 0; i < lessonCount; i += 1) {
    const lessonId = `lesson-${i}`;
    const questions = Array.from({ length: questionsPerLesson }, (_, j) => q(`${lessonId}-q${j}`));
    map.set(lessonId, questions);
  }
  return map;
}

describe('pickPhaseSkipQuestions', () => {
  it('elige exactamente 120 preguntas cuando el pool es suficiente', () => {
    const lessonIds = Array.from({ length: 40 }, (_, i) => `lesson-${i}`);
    const map = buildPool(40, 4);
    const picked = pickPhaseSkipQuestions(map, lessonIds);

    expect(picked).toHaveLength(PHASE_SKIP_MIN_QUESTIONS);
    expect(new Set(picked.map((question) => question.id)).size).toBe(PHASE_SKIP_MIN_QUESTIONS);
  });

  it('lanza error si el pool tiene menos de 120 preguntas', () => {
    const lessonIds = ['l1', 'l2'];
    const map = new Map<string, NormalizedQuizQuestion[]>([
      ['l1', [q('q1')]],
      ['l2', [q('q2')]],
    ]);

    expect(() => pickPhaseSkipQuestions(map, lessonIds)).toThrow(InsufficientPhaseSkipQuestionsError);
  });

  it('cuenta el total de preguntas en el pool', () => {
    const map = buildPool(10, 3);
    expect(countPhaseSkipPoolQuestions(map)).toBe(30);
  });
});
