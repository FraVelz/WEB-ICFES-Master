import { createHmac, timingSafeEqual } from 'crypto';
import type { NormalizedQuizQuestion } from '@/features/learning/roadmap/lessonQuiz/quizTypes';

const DEV_FALLBACK_SECRET = 'icfes-block-exam-dev-secret';

type BlockExamSessionPayload = {
  checkpointId: string;
  areaId: string;
  blockId: string;
  questions: NormalizedQuizQuestion[];
  exp: number;
};

function getSecret(): string {
  const dedicated = process.env.BLOCK_EXAM_SESSION_SECRET?.trim();
  if (dedicated) return dedicated;

  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (serviceRole) return serviceRole;

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'En producción configura BLOCK_EXAM_SESSION_SECRET o SUPABASE_SERVICE_ROLE_KEY para firmar exámenes por bloque'
    );
  }

  return DEV_FALLBACK_SECRET;
}

function signPayload(json: string): string {
  return createHmac('sha256', getSecret()).update(json).digest('base64url');
}

export function signBlockExamSession(payload: Omit<BlockExamSessionPayload, 'exp'>, ttlMs = 30 * 60 * 1000): string {
  const data: BlockExamSessionPayload = { ...payload, exp: Date.now() + ttlMs };
  const json = JSON.stringify(data);
  const signature = signPayload(json);
  return `${Buffer.from(json, 'utf8').toString('base64url')}.${signature}`;
}

export function verifyBlockExamSession(token: string): BlockExamSessionPayload | null {
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;

  let json: string;
  try {
    json = Buffer.from(encoded, 'base64url').toString('utf8');
  } catch {
    return null;
  }

  const expected = signPayload(json);
  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (sigBuffer.length !== expectedBuffer.length || !timingSafeEqual(sigBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(json) as BlockExamSessionPayload;
    if (!payload?.checkpointId || !Array.isArray(payload.questions) || typeof payload.exp !== 'number') {
      return null;
    }
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export function stripCorrectAnswers(questions: NormalizedQuizQuestion[]): NormalizedQuizQuestion[] {
  return questions.map((question) => ({
    ...question,
    correctAnswer: '',
    explanation: '',
  }));
}
