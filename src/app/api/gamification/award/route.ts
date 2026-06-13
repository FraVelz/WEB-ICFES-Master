import { NextRequest, NextResponse } from 'next/server';
import { spendCoinsServer } from '@/services/supabase/gamification/gamificationServerEconomy';
import { getAuthUserFromRequest } from '@/utils/apiAuth';
import { checkRateLimit, getClientIp } from '@/utils/rateLimit';
import { isAllowedSpendCoinsItem } from '@/shared/constants/gamificationAwardReasons';

const MAX_SPEND = 500;

type SpendBody = { type: 'spend_coins'; amount: number; item?: string };

function parseSpendBody(raw: unknown): SpendBody | null {
  if (!raw || typeof raw !== 'object') return null;
  const body = raw as Record<string, unknown>;
  if (body.type !== 'spend_coins') return null;

  const amount = body.amount;
  if (typeof amount !== 'number') return null;

  const item = body.item;
  return { type: 'spend_coins', amount, item: typeof item === 'string' ? item : 'purchase' };
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
    }

    const ip = getClientIp(request);
    const rate = await checkRateLimit(`gamification-award:${user.id}:${ip}`, 60, 60_000);
    if (!rate.allowed) {
      return NextResponse.json({ error: 'Demasiadas solicitudes. Intenta de nuevo en un momento.' }, { status: 429 });
    }

    const body = parseSpendBody(await request.json());
    if (!body) {
      return NextResponse.json({ error: 'Solo se admite gasto de monedas (spend_coins)' }, { status: 400 });
    }

    if (body.amount <= 0 || body.amount > MAX_SPEND) {
      return NextResponse.json({ error: 'Cantidad inválida' }, { status: 400 });
    }

    const spendItem = body.item ?? 'purchase';
    if (!isAllowedSpendCoinsItem(spendItem)) {
      return NextResponse.json({ error: 'Ítem de compra inválido' }, { status: 400 });
    }

    const result = await spendCoinsServer(user.id, body.amount, spendItem);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al procesar recompensa';
    const status = message.includes('insuficientes') ? 400 : 500;
    console.error('[api/gamification/award]', error);
    return NextResponse.json({ error: message }, { status });
  }
}
