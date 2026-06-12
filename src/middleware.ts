import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isProtectedDashboardPath } from '@/config/protectedRoutes';
import { DEMO_SESSION_COOKIE } from '@/utils/apiAuth';
import { createMiddlewareSupabaseClient } from '@/utils/supabase/middleware';

function hasApiSession(request: NextRequest): boolean {
  const auth = request.headers.get('Authorization');
  return auth?.startsWith('Bearer ') === true || request.cookies.get(DEMO_SESSION_COOKIE)?.value === '1';
}

function hasDemoSession(request: NextRequest): boolean {
  return request.cookies.get(DEMO_SESSION_COOKIE)?.value === '1';
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let response = NextResponse.next({ request });

  if (process.env.NODE_ENV === 'production' && pathname.startsWith('/dev/')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (pathname.startsWith('/api/exam/questions') && !hasApiSession(request)) {
    return NextResponse.json({ error: 'Debes iniciar sesión para acceder a las preguntas' }, { status: 401 });
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
    return NextResponse.redirect(loginUrl);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL('/login/', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    '/dev/:path*',
    '/api/exam/questions/:path*',
    '/ruta-aprendizaje/:path*',
    '/fases/:path*',
    '/clasificatoria/:path*',
    '/logros/:path*',
    '/perfil/:path*',
    '/configuracion/:path*',
    '/tienda/:path*',
    '/practica/:path*',
    '/examen-completo/:path*',
    '/evaluacion-nivel/:path*',
    '/importancia/:path*',
    '/consejos/:path*',
    '/informacion/:path*',
    '/lectura/:path*',
  ],
};
