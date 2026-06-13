import { NextRequest, NextResponse } from 'next/server';
import { gradeBlockExamSession } from '@/features/learning/roadmap/blockExam/blockExamServer';
import { getAuthUserFromRequest } from '@/utils/apiAuth';
import { checkRateLimit } from '@/utils/rateLimit';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Debes iniciar sesión para calificar el examen' }, { status: 401 });
    }

    const rate = await checkRateLimit(`block-exam-grade:${user.id}`, 30, 60_000);
    if (!rate.allowed) {
      return NextResponse.json({ error: 'Demasiadas solicitudes. Espera un momento.' }, { status: 429 });
    }

    const body = (await request.json()) as {
      sessionToken?: string;
      answers?: Record<string, string>;
    };

    const { sessionToken, answers } = body;
    if (!sessionToken || typeof sessionToken !== 'string') {
      return NextResponse.json({ error: 'Se requiere sessionToken' }, { status: 400 });
    }

    if (!answers || typeof answers !== 'object' || Object.keys(answers).length === 0) {
      return NextResponse.json({ error: 'Se requieren respuestas' }, { status: 400 });
    }

    const result = await gradeBlockExamSession(sessionToken, answers, user.id);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[api/learning/block-exam/grade]', error);
    const message = error instanceof Error ? error.message : 'No se pudo calificar el examen';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
