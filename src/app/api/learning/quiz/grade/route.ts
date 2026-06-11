import { NextRequest, NextResponse } from 'next/server';
import {
  awardLessonQuizRewards,
  gradeLessonQuizAnswers,
} from '@/features/learning/roadmap/lessonQuiz/lessonQuizGradingServer';
import { getAuthUserFromRequest } from '@/utils/apiAuth';
import { checkRateLimit } from '@/utils/rateLimit';
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Debes iniciar sesión para calificar el quiz' }, { status: 401 });
    }

    const rate = checkRateLimit(`lesson-quiz:${user.id}`, 40, 60_000);
    if (!rate.allowed) {
      return NextResponse.json({ error: 'Demasiadas solicitudes. Espera un momento.' }, { status: 429 });
    }

    const body = (await request.json()) as {
      lessonId?: string;
      answers?: Record<string, string>;
      awardRewards?: boolean;
      lessonXp?: number;
      lessonCoins?: number;
    };

    const { lessonId, answers, awardRewards, lessonXp, lessonCoins } = body;

    if (!lessonId || typeof lessonId !== 'string') {
      return NextResponse.json({ error: 'Se requiere lessonId' }, { status: 400 });
    }

    if (!answers || typeof answers !== 'object' || Object.keys(answers).length === 0) {
      return NextResponse.json({ error: 'Se requieren respuestas' }, { status: 400 });
    }

    const { results, allCorrect } = await gradeLessonQuizAnswers(lessonId, answers);

    let rewards: { xp: number; coins: number } | undefined;
    if (awardRewards && allCorrect) {
      rewards = await awardLessonQuizRewards(user.id, lessonId, lessonXp, lessonCoins);
    }

    return NextResponse.json({ results, allCorrect, rewards });
  } catch (error) {
    console.error('[api/learning/quiz/grade]', error);
    return NextResponse.json({ error: 'No se pudo calificar el quiz' }, { status: 500 });
  }
}
