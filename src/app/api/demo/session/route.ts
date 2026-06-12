import { NextRequest, NextResponse } from 'next/server';
import { DEMO_SESSION_COOKIE } from '@/utils/apiAuth';
import { checkRateLimit, getClientIp } from '@/utils/rateLimit';

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(`demo-session:${ip}`, 20, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Demasiadas solicitudes. Intenta de nuevo en un momento.' }, { status: 429 });
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set(DEMO_SESSION_COOKIE, '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 4,
  });

  return response;
}

export async function DELETE(request: NextRequest) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(`demo-session-delete:${ip}`, 30, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Demasiadas solicitudes. Intenta de nuevo en un momento.' }, { status: 429 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.delete(DEMO_SESSION_COOKIE);
  return response;
}
