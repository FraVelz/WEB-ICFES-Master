import { NextRequest, NextResponse } from 'next/server';
import { qualifyReferralForInvitee } from '@/services/referrals/referralRewardService';
import { getAuthUserFromRequest } from '@/utils/apiAuth';
import { checkRateLimit } from '@/utils/rateLimit';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
    }

    const rate = await checkRateLimit(`referral-qualify:${user.id}`, 20, 60_000);
    if (!rate.allowed) {
      return NextResponse.json({ error: 'Demasiadas solicitudes. Intenta de nuevo en un momento.' }, { status: 429 });
    }

    const result = await qualifyReferralForInvitee(user.id);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error('[api/referrals/qualify]', error);
    return NextResponse.json({ error: 'No se pudo calificar el referido' }, { status: 500 });
  }
}
