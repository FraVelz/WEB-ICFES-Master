import { describe, it, expect } from 'vitest';
import { mergeAttemptHistories, mapExamResultRowToAttempt } from './examSyncService';

describe('examSyncService', () => {
  it('mergeAttemptHistories deduplicates local attempts already synced remotely', () => {
    const userId = 'user-1';
    const local = [{ id: 100, date: '2026-06-01T10:00:00.000Z', type: 'practice' }];
    const remote = [
      mapExamResultRowToAttempt({
        id: 'migrated_user-1_100',
        exam_type: 'matematicas',
        completed_at: '2026-06-01T10:00:00.000Z',
        correct_answers: 5,
        total_questions: 10,
        score: 50,
        questions: { questions: [], answers: {} },
      }),
    ];

    const merged = mergeAttemptHistories(userId, local, remote);
    expect(merged).toHaveLength(1);
    expect(merged[0].id).toBe('migrated_user-1_100');
  });

  it('mapExamResultRowToAttempt maps practice rows', () => {
    const attempt = mapExamResultRowToAttempt({
      id: 'exam-1',
      exam_type: 'matematicas',
      completed_at: '2026-06-02T12:00:00.000Z',
      correct_answers: 8,
      total_questions: 10,
      score: 80,
      questions: {
        questions: [{ id: 'q1', correctAnswer: 'A' }],
        answers: { q1: 'A' },
        areaName: 'Matemáticas',
      },
    });

    expect(attempt.type).toBe('practice');
    expect(attempt.practiceArea).toBe('matematicas');
    expect(attempt.correctCount).toBe(8);
  });
});
