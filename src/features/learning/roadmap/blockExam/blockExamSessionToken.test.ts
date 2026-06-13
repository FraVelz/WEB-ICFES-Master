import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { signBlockExamSession, verifyBlockExamSession } from './blockExamSessionToken';
import type { NormalizedQuizQuestion } from '@/features/learning/roadmap/lessonQuiz/quizTypes';

const sampleQuestion: NormalizedQuizQuestion = {
  id: 'q1',
  question: 'Test',
  options: [{ id: 'a', text: 'A' }],
  correctAnswer: 'a',
  explanation: '',
  difficulty: 'facil',
};

describe('blockExamSessionToken', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.NODE_ENV = 'test';
    delete process.env.BLOCK_EXAM_SESSION_SECRET;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('firma y verifica con SUPABASE_SERVICE_ROLE_KEY cuando no hay secreto dedicado', () => {
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';

    const token = signBlockExamSession({
      checkpointId: 'cp-1',
      areaId: 'matematicas',
      blockId: 'block-1',
      questions: [sampleQuestion],
    });

    const payload = verifyBlockExamSession(token);
    expect(payload?.checkpointId).toBe('cp-1');
    expect(payload?.questions).toHaveLength(1);
  });

  it('prefiere BLOCK_EXAM_SESSION_SECRET sobre SUPABASE_SERVICE_ROLE_KEY', () => {
    process.env.BLOCK_EXAM_SESSION_SECRET = 'dedicated-secret';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key';

    const token = signBlockExamSession({
      checkpointId: 'cp-2',
      areaId: 'lectura-critica',
      blockId: 'block-2',
      questions: [sampleQuestion],
    });

    delete process.env.BLOCK_EXAM_SESSION_SECRET;
    expect(verifyBlockExamSession(token)).toBeNull();

    process.env.BLOCK_EXAM_SESSION_SECRET = 'dedicated-secret';
    expect(verifyBlockExamSession(token)?.checkpointId).toBe('cp-2');
  });
});
