import { NextRequest, NextResponse } from 'next/server';
import {
  InsufficientPhaseSkipQuestionsError,
  startPhaseSkipSession,
} from '@/features/learning/phaseSkip/phaseSkipServer';
import { getAuthUserFromRequest } from '@/utils/apiAuth';
import { checkRateLimit } from '@/utils/rateLimit';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Debes iniciar sesión para iniciar el simulacro' }, { status: 401 });
    }

    const rate = await checkRateLimit(`phase-skip-start:${user.id}`, 10, 60_000);
    if (!rate.allowed) {
      return NextResponse.json({ error: 'Demasiadas solicitudes. Espera un momento.' }, { status: 429 });
    }

    const body = (await request.json()) as {
      areaId?: string;
      sectionId?: string;
      lessonIds?: string[];
    };

    const { areaId, sectionId, lessonIds } = body;
    if (!areaId || typeof areaId !== 'string') {
      return NextResponse.json({ error: 'Se requiere areaId' }, { status: 400 });
    }

    if (!sectionId || typeof sectionId !== 'string') {
      return NextResponse.json({ error: 'Se requiere sectionId (etapa)' }, { status: 400 });
    }

    if (!Array.isArray(lessonIds) || lessonIds.length === 0) {
      return NextResponse.json({ error: 'Se requieren lessonIds de la fase' }, { status: 400 });
    }

    const session = await startPhaseSkipSession(areaId, sectionId, lessonIds);
    return NextResponse.json(session);
  } catch (error) {
    console.error('[api/learning/phase-skip/start]', error);
    if (error instanceof InsufficientPhaseSkipQuestionsError) {
      return NextResponse.json(
        { error: error.message, code: error.code, available: error.available, required: error.required },
        { status: 400 }
      );
    }
    const message = error instanceof Error ? error.message : 'No se pudo iniciar el simulacro';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
