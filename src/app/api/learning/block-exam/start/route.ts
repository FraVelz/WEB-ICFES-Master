import { NextRequest, NextResponse } from 'next/server';
import { startBlockExamSession } from '@/features/learning/roadmap/blockExam/blockExamServer';
import { getAuthUserFromRequest } from '@/utils/apiAuth';
import { checkRateLimit } from '@/utils/rateLimit';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Debes iniciar sesión para iniciar el examen' }, { status: 401 });
    }

    const rate = await checkRateLimit(`block-exam-start:${user.id}`, 20, 60_000);
    if (!rate.allowed) {
      return NextResponse.json({ error: 'Demasiadas solicitudes. Espera un momento.' }, { status: 429 });
    }

    const body = (await request.json()) as {
      checkpointId?: string;
      lessonIds?: string[];
    };

    const { checkpointId, lessonIds } = body;
    if (!checkpointId || typeof checkpointId !== 'string') {
      return NextResponse.json({ error: 'Se requiere checkpointId' }, { status: 400 });
    }

    if (!Array.isArray(lessonIds) || lessonIds.length === 0) {
      return NextResponse.json({ error: 'Se requieren lessonIds del bloque' }, { status: 400 });
    }

    const session = await startBlockExamSession(checkpointId, lessonIds);
    return NextResponse.json(session);
  } catch (error) {
    console.error('[api/learning/block-exam/start]', error);
    const message = error instanceof Error ? error.message : 'No se pudo iniciar el examen';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
