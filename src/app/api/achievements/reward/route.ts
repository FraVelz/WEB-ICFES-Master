import { NextRequest, NextResponse } from 'next/server';
import { awardAchievementRewardsServer } from '@/services/achievements/achievementRewardServer';
import { getAuthUserFromRequest } from '@/utils/apiAuth';
import { checkRateLimit } from '@/utils/rateLimit';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
    }

    const rate = await checkRateLimit(`achievement-reward:${user.id}`, 30, 60_000);
    if (!rate.allowed) {
      return NextResponse.json({ error: 'Demasiadas solicitudes. Intenta de nuevo en un momento.' }, { status: 429 });
    }

    const body = (await request.json()) as { achievementIds?: unknown };
    const rawIds = body.achievementIds;

    if (!Array.isArray(rawIds) || rawIds.length === 0) {
      return NextResponse.json({ error: 'Se requieren achievementIds' }, { status: 400 });
    }

    if (rawIds.length > 20) {
      return NextResponse.json({ error: 'Demasiados logros en una sola petición' }, { status: 400 });
    }

    const achievementIds = rawIds.filter((id): id is string => typeof id === 'string' && id.length <= 64);
    if (achievementIds.length === 0) {
      return NextResponse.json({ error: 'achievementIds inválidos' }, { status: 400 });
    }

    const result = await awardAchievementRewardsServer(user.id, achievementIds);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[api/achievements/reward]', error);
    return NextResponse.json({ error: 'No se pudieron otorgar las recompensas' }, { status: 500 });
  }
}
