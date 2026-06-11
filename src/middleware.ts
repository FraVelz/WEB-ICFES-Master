import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { DEMO_SESSION_COOKIE } from '@/utils/apiAuth';

function hasApiSession(request: NextRequest): boolean {
  const auth = request.headers.get('Authorization');
  return auth?.startsWith('Bearer ') === true || request.cookies.get(DEMO_SESSION_COOKIE)?.value === '1';
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (process.env.NODE_ENV === 'production' && pathname.startsWith('/dev/')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (pathname.startsWith('/api/exam/questions') && !hasApiSession(request)) {
    return NextResponse.json({ error: 'Debes iniciar sesión para acceder a las preguntas' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dev/:path*', '/api/exam/questions/:path*'],
};
