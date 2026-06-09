import { describe, expect, it } from 'vitest';

import { mapLocalAttemptToExamResult } from '@/services/demo/mapLocalAttemptToExamResult';

describe('mapLocalAttemptToExamResult', () => {
  it('mapea práctica con porcentaje y área', () => {
    const row = mapLocalAttemptToExamResult('user-1', {
      id: 1710000000000,
      type: 'practice',
      practiceArea: 'matematicas',
      date: '2026-06-01T12:00:00.000Z',
      correctCount: 8,
      percentage: 80,
      totalQuestions: 10,
      questions: [{ id: 'q1', correctAnswer: 'A' }],
      answers: { q1: 'A' },
      areaName: 'Matemáticas',
    });

    expect(row.id).toBe('migrated_user-1_1710000000000');
    expect(row.user_id).toBe('user-1');
    expect(row.exam_type).toBe('matematicas');
    expect(row.score).toBe(80);
    expect(row.correct_answers).toBe(8);
    expect(row.total_questions).toBe(10);
    expect(row.completed_at).toBe('2026-06-01T12:00:00.000Z');
    expect(row.questions.migratedFrom).toBe('demo');
  });

  it('mapea examen completo y calcula score si falta porcentaje', () => {
    const row = mapLocalAttemptToExamResult('user-1', {
      id: 'exam-1',
      type: 'full-exam',
      completedAt: '2026-06-02T10:00:00.000Z',
      questions: [
        { id: 'q1', correctAnswer: 'A' },
        { id: 'q2', correctAnswer: 'B' },
      ],
      answers: { q1: 'A', q2: 'C' },
    });

    expect(row.exam_type).toBe('full-exam');
    expect(row.correct_answers).toBe(1);
    expect(row.total_questions).toBe(2);
    expect(row.score).toBe(50);
  });
});
