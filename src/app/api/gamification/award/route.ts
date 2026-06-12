import { NextRequest, NextResponse } from 'next/server';
import {
  addCoinsServer,
  addXpServerWithMultiplier,
  spendCoinsServer,
} from '@/services/supabase/gamification/gamificationServerEconomy';
import { getAuthUserFromRequest } from '@/utils/apiAuth';
import { checkRateLimit, getClientIp } from '@/utils/rateLimit';
import {
  isAllowedCoinsAwardReason,
  isAllowedSpendCoinsItem,
  isAllowedXpAwardReason,
} from '@/shared/constants/gamificationAwardReasons';

const MAX_AWARD = 500;
const MAX_REASON_LENGTH = 64;

type AwardBody =
  | { type: 'xp'; points: number; reason: string }
  | { type: 'coins'; amount: number; reason: string }
  | { type: 'spend_coins'; amount: number; item?: string };

function parseBody(raw: unknown): AwardBody | null {
  if (!raw || typeof raw !== 'object') return null;
  const body = raw as Record<string, unknown>;
  const type = body.type;

  if (type === 'xp') {
    const points = body.points;
    const reason = body.reason;
    if (typeof points !== 'number' || typeof reason !== 'string') return null;
    return { type: 'xp', points, reason };
  }

  if (type === 'coins') {
    const amount = body.amount;
    const reason = body.reason;
    if (typeof amount !== 'number' || typeof reason !== 'string') return null;
    return { type: 'coins', amount, reason };
  }

  if (type === 'spend_coins') {
    const amount = body.amount;
    const item = body.item;
    if (typeof amount !== 'number') return null;
    return { type: 'spend_coins', amount, item: typeof item === 'string' ? item : 'purchase' };
  }

  return null;
}

function validateReason(reason: string): boolean {
  const trimmed = reason.trim();
  return trimmed.length > 0 && trimmed.length <= MAX_REASON_LENGTH;
}

function validateXpReason(reason: string): boolean {
  return validateReason(reason) && isAllowedXpAwardReason(reason);
}

function validateCoinsReason(reason: string): boolean {
  return validateReason(reason) && isAllowedCoinsAwardReason(reason);
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

    const body = parseBody(await request.json());
    if (!body) {
      return NextResponse.json({ error: 'Cuerpo de solicitud inválido' }, { status: 400 });
    }

    const userId = user.id;

    if (body.type === 'xp') {
      if (body.points <= 0 || body.points > MAX_AWARD || !validateXpReason(body.reason)) {
        return NextResponse.json({ error: 'Parámetros XP inválidos' }, { status: 400 });
      }
      const result = await addXpServerWithMultiplier(userId, body.points, body.reason.trim());
      return NextResponse.json(result);
    }

    if (body.type === 'coins') {
      if (body.amount <= 0 || body.amount > MAX_AWARD || !validateCoinsReason(body.reason)) {
        return NextResponse.json({ error: 'Parámetros de monedas inválidos' }, { status: 400 });
      }
      const result = await addCoinsServer(userId, body.amount, body.reason.trim());
      return NextResponse.json(result);
    }

    if (body.amount <= 0 || body.amount > MAX_AWARD) {
      return NextResponse.json({ error: 'Cantidad inválida' }, { status: 400 });
    }

    const spendItem = body.item ?? 'purchase';
    if (!isAllowedSpendCoinsItem(spendItem)) {
      return NextResponse.json({ error: 'Ítem de compra inválido' }, { status: 400 });
    }

    const result = await spendCoinsServer(userId, body.amount, spendItem);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al procesar recompensa';
    const status = message.includes('insuficientes') ? 400 : 500;
    console.error('[api/gamification/award]', error);
    return NextResponse.json({ error: message }, { status });
  }
}
