import { createHmac, timingSafeEqual } from 'crypto';

const DEV_FALLBACK_SECRET = 'icfes-exam-timer-dev-secret';

/** Signed exam timer / attempt start — server wall clock is the source of truth. */
export type ExamTimerPayload = {
  startedAt: number;
  /** Absolute end (ms); null when the attempt has no countdown. */
  endsAt: number | null;
  questionCount: number;
  /** Attempt kind for audit / XP checks. */
  attemptType: 'practice' | 'full-exam';
  exp: number;
};

function getSecret(): string {
  const dedicated = process.env.EXAM_TIMER_SECRET?.trim() || process.env.BLOCK_EXAM_SESSION_SECRET?.trim();
  if (dedicated) return dedicated;

  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (serviceRole) return serviceRole;

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'En producción configura EXAM_TIMER_SECRET, BLOCK_EXAM_SESSION_SECRET o SUPABASE_SERVICE_ROLE_KEY para firmar el timer de examen'
    );
  }

  return DEV_FALLBACK_SECRET;
}

function signPayload(json: string): string {
  return createHmac('sha256', getSecret()).update(json).digest('base64url');
}

export function signExamTimer(payload: Omit<ExamTimerPayload, 'exp'>, ttlMs = 6 * 60 * 60 * 1000): string {
  const data: ExamTimerPayload = { ...payload, exp: Date.now() + ttlMs };
  const json = JSON.stringify(data);
  const signature = signPayload(json);
  return `${Buffer.from(json, 'utf8').toString('base64url')}.${signature}`;
}

export function verifyExamTimer(token: string): ExamTimerPayload | null {
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
    const payload = JSON.parse(json) as ExamTimerPayload;
    if (
      typeof payload.startedAt !== 'number' ||
      typeof payload.questionCount !== 'number' ||
      typeof payload.exp !== 'number' ||
      (payload.attemptType !== 'practice' && payload.attemptType !== 'full-exam')
    ) {
      return null;
    }
    if (payload.endsAt != null && typeof payload.endsAt !== 'number') return null;
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Minimum plausible wall time before XP can count toward weekly leagues. */
export const MIN_MS_PER_QUESTION_FOR_XP = 2_000;

export function isPlausibleExamElapsed(
  startedAt: number,
  questionCount: number,
  now: number = Date.now(),
  minMsPerQuestion: number = MIN_MS_PER_QUESTION_FOR_XP
): boolean {
  if (!Number.isFinite(startedAt) || startedAt <= 0) return false;
  if (!Number.isFinite(questionCount) || questionCount < 1) return false;
  if (startedAt > now + 5_000) return false; // clock skew / forged start
  const minElapsed = questionCount * minMsPerQuestion;
  return now - startedAt >= minElapsed;
}
