import { NextRequest, NextResponse } from 'next/server';
import { countPhaseSkipQuestionsAvailable } from '@/features/learning/phaseSkip/phaseSkipServer';
import { getAuthUserFromRequest } from '@/utils/apiAuth';
import { checkRateLimit } from '@/utils/rateLimit';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Debes iniciar sesión para consultar disponibilidad' }, { status: 401 });
    }

    const rate = await checkRateLimit(`phase-skip-availability:${user.id}`, 60, 60_000);
    if (!rate.allowed) {
      return NextResponse.json({ error: 'Demasiadas solicitudes. Espera un momento.' }, { status: 429 });
    }

    const body = (await request.json()) as { lessonIds?: string[] };
    const lessonIds = Array.isArray(body.lessonIds) ? body.lessonIds : [];

    const availability = await countPhaseSkipQuestionsAvailable(lessonIds);
    return NextResponse.json(availability);
  } catch (error) {
    console.error('[api/learning/phase-skip/availability]', error);
    const message = error instanceof Error ? error.message : 'No se pudo consultar disponibilidad';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
