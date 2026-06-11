import { NextResponse } from 'next/server';
import { DEMO_SESSION_COOKIE } from '@/utils/apiAuth';

export async function POST() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set(DEMO_SESSION_COOKIE, '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(DEMO_SESSION_COOKIE);
  return response;
}
