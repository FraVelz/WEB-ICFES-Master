import { NextRequest, NextResponse } from 'next/server';
import {
  addCoinsServer,
  addXpServerWithMultiplier,
  hasRewardReason,
} from '@/services/supabase/gamification/gamificationServerEconomy';
import { getAuthUserFromRequest, hasDemoSession } from '@/utils/apiAuth';
import { checkRateLimit } from '@/utils/rateLimit';
import { parseDemoMigrationPayload } from '@/services/demo/computeDemoMigrationBalances';

/** One-shot demo → account XP/coins. Caps are enforced server-side; full anti-fraud needs a server ledger. */
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
    }

    if (!hasDemoSession(request)) {
      return NextResponse.json(
        { error: 'La migración demo requiere haber usado el modo demo en esta sesión' },
        { status: 403 }
      );
    }

    const rate = await checkRateLimit(`demo-migrate:${user.id}`, 5, 60_000);
    if (!rate.allowed) {
      return NextResponse.json({ error: 'Demasiadas solicitudes. Intenta de nuevo en un momento.' }, { status: 429 });
    }

    const body = await request.json();
    const parsed = parseDemoMigrationPayload(body);
    if (!parsed) {
      return NextResponse.json(
        { error: 'Cantidad inválida o fuera de los límites de migración demo' },
        { status: 400 }
      );
    }

    const { xp, coins } = parsed;

    if (xp === 0 && coins === 0) {
      return NextResponse.json({ error: 'No hay progreso demo para migrar' }, { status: 400 });
    }

    const xpReason = 'demo_migration';
    const coinsReason = 'demo_migration';

    const [xpAlready, coinsAlready] = await Promise.all([
      hasRewardReason(user.id, xpReason),
      hasRewardReason(user.id, coinsReason),
    ]);

    const [xpResult, coinsResult] = await Promise.all([
      xp > 0 && !xpAlready ? addXpServerWithMultiplier(user.id, xp, xpReason) : Promise.resolve(null),
      coins > 0 && !coinsAlready ? addCoinsServer(user.id, coins, coinsReason) : Promise.resolve(null),
    ]);

    return NextResponse.json({
      xpAwarded: xpResult?.awarded ?? false,
      coinsAwarded: coinsResult?.awarded ?? false,
      alreadyMigrated: (xp > 0 && xpAlready) || (coins > 0 && coinsAlready),
    });
  } catch (error) {
    console.error('[api/gamification/migrate-demo]', error);
    return NextResponse.json({ error: 'No se pudo migrar el progreso demo' }, { status: 500 });
  }
}
