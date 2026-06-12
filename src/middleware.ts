import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isProtectedDashboardPath } from '@/config/protectedRoutes';
import { DEMO_SESSION_COOKIE } from '@/utils/apiAuth';
import { applySecurityHeaders } from '@/utils/contentSecurityPolicy';
import { createMiddlewareSupabaseClient } from '@/utils/supabase/middleware';

function hasApiSession(request: NextRequest): boolean {
  const auth = request.headers.get('Authorization');
  return auth?.startsWith('Bearer ') === true || request.cookies.get(DEMO_SESSION_COOKIE)?.value === '1';
}

function hasDemoSession(request: NextRequest): boolean {
  return request.cookies.get(DEMO_SESSION_COOKIE)?.value === '1';
}

function withNonce(request: NextRequest): { requestHeaders: Headers; nonce: string } {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  return { requestHeaders, nonce };
}

function secureResponse(response: NextResponse, nonce: string): NextResponse {
  applySecurityHeaders(response, nonce);
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { requestHeaders, nonce } = withNonce(request);
  let response = secureResponse(NextResponse.next({ request: { headers: requestHeaders } }), nonce);

  if (process.env.NODE_ENV === 'production' && pathname.startsWith('/dev/')) {
    return secureResponse(NextResponse.redirect(new URL('/', request.url)), nonce);
  }

  if (pathname.startsWith('/api/exam/questions') && !hasApiSession(request)) {
    return secureResponse(
      NextResponse.json({ error: 'Debes iniciar sesión para acceder a las preguntas' }, { status: 401 }),
      nonce
    );
  }

  if (!isProtectedDashboardPath(pathname)) {
    return response;
  }

  if (hasDemoSession(request)) {
    return response;
  }

  const supabase = createMiddlewareSupabaseClient(request, response);
  if (!supabase) {
    const loginUrl = new URL('/login/', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return secureResponse(NextResponse.redirect(loginUrl), nonce);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL('/login/', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return secureResponse(NextResponse.redirect(loginUrl), nonce);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
