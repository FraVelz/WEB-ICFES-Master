import { NextRequest, NextResponse } from 'next/server';
import {
  fetchPublicQuestionsByRouteArea,
  fetchPublicQuestionsForFullExam,
} from '@/features/exam/services/examQuestionsServer';
import { getAuthUserFromRequest, hasApiAccess } from '@/utils/apiAuth';
import { checkRateLimit, getClientIp } from '@/utils/rateLimit';

export async function GET(request: NextRequest) {
  const user = await getAuthUserFromRequest(request);
  if (!hasApiAccess(request, user)) {
    return NextResponse.json({ error: 'Debes iniciar sesión para acceder a las preguntas' }, { status: 401 });
  }

  const ip = getClientIp(request);
  const rateKey = user ? `exam-questions:${user.id}` : `exam-questions:demo:${ip}`;
  const rate = await checkRateLimit(rateKey, 60, 60_000);

  if (!rate.allowed) {
    return NextResponse.json({ error: 'Demasiadas solicitudes. Intenta de nuevo en un momento.' }, { status: 429 });
  }

  const area = request.nextUrl.searchParams.get('area');
  const full = request.nextUrl.searchParams.get('full') === '1';

  try {
    const questions = full
      ? await fetchPublicQuestionsForFullExam()
      : area
        ? await fetchPublicQuestionsByRouteArea(area)
        : [];

    if (!full && !area) {
      return NextResponse.json({ error: 'Se requiere el parámetro area o full=1' }, { status: 400 });
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('[api/exam/questions]', error);
    return NextResponse.json({ error: 'No se pudieron cargar las preguntas' }, { status: 500 });
  }
}
