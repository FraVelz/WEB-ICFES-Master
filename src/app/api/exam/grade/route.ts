import { NextRequest, NextResponse } from 'next/server';
import { gradeExamAnswers } from '@/features/exam/services/examGradingServer';
import { sanitizeGradedResultsForDemo } from '@/features/exam/utils/sanitizeGradedResults';
import { isPlausibleExamElapsed, verifyExamTimer } from '@/features/exam/utils/examTimerToken';
import { awardActivityXpServer, type ActivityAttemptType } from '@/services/exam/activityXpServer';
import { getAuthUserFromRequest, hasApiAccess, isDemoOnlyAccess } from '@/utils/apiAuth';
import { checkRateLimit, getClientIp } from '@/utils/rateLimit';

function parseActivityAward(
  raw: unknown
): { attemptType: ActivityAttemptType; attemptId: number; timerToken?: string } | null {
  if (!raw || typeof raw !== 'object') return null;
  const body = raw as Record<string, unknown>;
  const attemptType = body.attemptType;
  const attemptId = body.attemptId;
  const timerToken = typeof body.timerToken === 'string' ? body.timerToken : undefined;

  if (attemptType !== 'practice' && attemptType !== 'full-exam') return null;
  if (typeof attemptId !== 'number' || !Number.isFinite(attemptId) || attemptId <= 0) return null;

  return { attemptType, attemptId: Math.floor(attemptId), timerToken };
}

/**
 * League XP anti-abuse (B3-2): require a valid signed timer and plausible elapsed time.
 * Grading always returns; only the XP award is gated.
 */
function canAwardLeagueXp(
  award: { attemptType: ActivityAttemptType; timerToken?: string },
  answerCount: number
): { ok: true } | { ok: false; reason: string } {
  if (!award.timerToken) {
    return { ok: false, reason: 'missing_timer_token' };
  }

  const payload = verifyExamTimer(award.timerToken);
  if (!payload) {
    return { ok: false, reason: 'invalid_timer_token' };
  }

  if (payload.attemptType !== award.attemptType) {
    return { ok: false, reason: 'attempt_type_mismatch' };
  }

  const questionCount = Math.max(payload.questionCount, answerCount);
  if (!isPlausibleExamElapsed(payload.startedAt, questionCount)) {
    return { ok: false, reason: 'implausible_elapsed' };
  }

  return { ok: true };
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!hasApiAccess(request, user)) {
      return NextResponse.json({ error: 'Debes iniciar sesión o usar el modo demo oficial' }, { status: 401 });
    }

    const ip = getClientIp(request);
    const rateKey = user ? `exam-grade:user:${user.id}` : `exam-grade:demo:${ip}`;
    const limit = user ? 30 : 10;
    const rate = await checkRateLimit(rateKey, limit, 60_000);

    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes de calificación. Espera un momento.' },
        { status: 429 }
      );
    }

    const body = (await request.json()) as {
      answers?: Record<string, string>;
      awardActivity?: unknown;
    };
    const answers = body.answers;

    if (!answers || typeof answers !== 'object' || Object.keys(answers).length === 0) {
      return NextResponse.json({ error: 'Se requieren respuestas para calificar' }, { status: 400 });
    }

    if (Object.keys(answers).length > 200) {
      return NextResponse.json({ error: 'Demasiadas respuestas en una sola petición' }, { status: 400 });
    }

    for (const value of Object.values(answers)) {
      if (typeof value !== 'string' || value.length > 8) {
        return NextResponse.json({ error: 'Formato de respuesta inválido' }, { status: 400 });
      }
    }

    const results = await gradeExamAnswers(answers);
    const payload = isDemoOnlyAccess(request, user) ? sanitizeGradedResultsForDemo(results) : results;

    let activityXp: { awarded: boolean; xp: number; points: number; skippedReason?: string } | undefined;
    const activityAward = parseActivityAward(body.awardActivity);

    if (user && activityAward && !isDemoOnlyAccess(request, user)) {
      const eligibility = canAwardLeagueXp(activityAward, Object.keys(answers).length);
      if (!eligibility.ok) {
        activityXp = { awarded: false, xp: 0, points: 0, skippedReason: eligibility.reason };
      } else {
        const correctCount = results.filter((result) => result.correct).length;
        activityXp = await awardActivityXpServer(
          user.id,
          activityAward.attemptType,
          correctCount,
          activityAward.attemptId
        );
      }
    }

    return NextResponse.json({ results: payload, activityXp });
  } catch (error) {
    console.error('[api/exam/grade]', error);
    return NextResponse.json({ error: 'No se pudo calificar el examen' }, { status: 500 });
  }
}
