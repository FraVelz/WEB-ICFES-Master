import { createHmac, timingSafeEqual } from 'crypto';
import type { NormalizedQuizQuestion } from '@/features/learning/roadmap/lessonQuiz/quizTypes';
import { PHASE_SKIP_SESSION_TTL_MS } from './phaseSkipConstants';

const DEV_FALLBACK_SECRET = 'icfes-phase-skip-dev-secret';

type PhaseSkipSessionPayload = {
  areaId: string;
  sectionId: string;
  lessonIds: string[];
  questions: NormalizedQuizQuestion[];
  exp: number;
};

function getSecret(): string {
  const dedicated = process.env.PHASE_SKIP_SESSION_SECRET?.trim();
  if (dedicated) return dedicated;

  const blockExam = process.env.BLOCK_EXAM_SESSION_SECRET?.trim();
  if (blockExam) return blockExam;

  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (serviceRole) return serviceRole;

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'En producción configura PHASE_SKIP_SESSION_SECRET, BLOCK_EXAM_SESSION_SECRET o SUPABASE_SERVICE_ROLE_KEY para firmar simulacros de fase'
    );
  }

  return DEV_FALLBACK_SECRET;
}

function signPayload(json: string): string {
  return createHmac('sha256', getSecret()).update(json).digest('base64url');
}

export function signPhaseSkipSession(
  payload: Omit<PhaseSkipSessionPayload, 'exp'>,
  ttlMs = PHASE_SKIP_SESSION_TTL_MS
): string {
  const data: PhaseSkipSessionPayload = { ...payload, exp: Date.now() + ttlMs };
  const json = JSON.stringify(data);
  const signature = signPayload(json);
  return `${Buffer.from(json, 'utf8').toString('base64url')}.${signature}`;
}

export function verifyPhaseSkipSession(token: string): PhaseSkipSessionPayload | null {
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
    const payload = JSON.parse(json) as PhaseSkipSessionPayload;
    if (
      !payload?.areaId ||
      !payload?.sectionId ||
      !Array.isArray(payload.lessonIds) ||
      !Array.isArray(payload.questions) ||
      typeof payload.exp !== 'number'
    ) {
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
