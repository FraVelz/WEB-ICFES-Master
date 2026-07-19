import { NextRequest, NextResponse } from 'next/server';
import { fetchPublishedCoverageByArea } from '@/features/exam/services/examQuestionsServer';
import { checkRateLimit, getClientIp } from '@/utils/rateLimit';

/** Cobertura pública del banco (conteos published por área) — sin inventar marketing. */
export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const rate = await checkRateLimit(`exam-coverage:${ip}`, 60, 60_000);

  if (!rate.allowed) {
    return NextResponse.json({ error: 'Demasiadas solicitudes. Intenta de nuevo en un momento.' }, { status: 429 });
  }

  try {
    const coverage = await fetchPublishedCoverageByArea();
    return NextResponse.json({ coverage });
  } catch (error) {
    console.error('[api/exam/coverage]', error);
    return NextResponse.json({ error: 'No se pudo cargar la cobertura del banco' }, { status: 500 });
  }
}
