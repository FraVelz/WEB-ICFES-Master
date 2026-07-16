import { NextRequest, NextResponse } from 'next/server';
import { signExamTimer } from '@/features/exam/utils/examTimerToken';
import { getAuthUserFromRequest, hasApiAccess } from '@/utils/apiAuth';
import { checkRateLimit, getClientIp } from '@/utils/rateLimit';

const MAX_DURATION_SEC = 4 * 60 * 60; // 4h hard cap (full simulacro ~3h)
const MAX_QUESTIONS = 200;

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!hasApiAccess(request, user)) {
      return NextResponse.json({ error: 'Debes iniciar sesión o usar el modo demo oficial' }, { status: 401 });
    }

    const ip = getClientIp(request);
    const rateKey = user ? `exam-timer:user:${user.id}` : `exam-timer:demo:${ip}`;
    const rate = await checkRateLimit(rateKey, 40, 60_000);
    if (!rate.allowed) {
      return NextResponse.json({ error: 'Demasiadas solicitudes de timer. Espera un momento.' }, { status: 429 });
    }

    const body = (await request.json()) as {
      durationSec?: number | null;
      questionCount?: number;
      attemptType?: 'practice' | 'full-exam';
    };

    const attemptType = body.attemptType === 'full-exam' ? 'full-exam' : 'practice';
    const questionCount = Math.floor(Number(body.questionCount));
    if (!Number.isFinite(questionCount) || questionCount < 1 || questionCount > MAX_QUESTIONS) {
      return NextResponse.json({ error: 'questionCount inválido' }, { status: 400 });
    }

    let durationSec: number | null = null;
    if (body.durationSec != null) {
      const raw = Number(body.durationSec);
      if (!Number.isFinite(raw) || raw < 1 || raw > MAX_DURATION_SEC) {
        return NextResponse.json({ error: 'durationSec inválido' }, { status: 400 });
      }
      durationSec = Math.floor(raw);
    }

    const startedAt = Date.now();
    const endsAt = durationSec != null ? startedAt + durationSec * 1000 : null;
    const timerToken = signExamTimer({
      startedAt,
      endsAt,
      questionCount,
      attemptType,
    });

    return NextResponse.json({ timerToken, startedAt, endsAt, questionCount, attemptType });
  } catch (error) {
    console.error('[api/exam/timer]', error);
    return NextResponse.json({ error: 'No se pudo emitir el timer firmado' }, { status: 500 });
  }
}
