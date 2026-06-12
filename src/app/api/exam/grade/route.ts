import { NextRequest, NextResponse } from 'next/server';
import { gradeExamAnswers } from '@/features/exam/services/examGradingServer';
import { sanitizeGradedResultsForDemo } from '@/features/exam/utils/sanitizeGradedResults';
import { getAuthUserFromRequest, hasApiAccess, isDemoOnlyAccess } from '@/utils/apiAuth';
import { checkRateLimit, getClientIp } from '@/utils/rateLimit';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!hasApiAccess(request, user)) {
      return NextResponse.json({ error: 'Debes iniciar sesión o usar el modo demo oficial' }, { status: 401 });
    }

    const ip = getClientIp(request);
    const rateKey = user ? `exam-grade:user:${user.id}` : `exam-grade:demo:${ip}`;
    const limit = user ? 30 : 10;
    const rate = checkRateLimit(rateKey, limit, 60_000);

    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes de calificación. Espera un momento.' },
        { status: 429 }
      );
    }

    const body = (await request.json()) as { answers?: Record<string, string> };
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

    return NextResponse.json({ results: payload });
  } catch (error) {
    console.error('[api/exam/grade]', error);
    return NextResponse.json({ error: 'No se pudo calificar el examen' }, { status: 500 });
  }
}
