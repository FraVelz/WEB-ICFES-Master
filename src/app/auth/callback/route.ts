import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { resolveSafeInternalRedirect } from '@/utils/safeRedirect';

type CookieToSet = { name: string; value: string; options: CookieOptions };

function withTrailingSlash(path: string): string {
  if (path === '/') return path;
  return path.endsWith('/') ? path : `${path}/`;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const next = withTrailingSlash(resolveSafeInternalRedirect(searchParams.get('next')));

  if (searchParams.get('error') || searchParams.get('error_description')) {
    return NextResponse.redirect(new URL('/login/', origin));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/login/', origin));
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.redirect(new URL('/login/', origin));
  }

  let response = NextResponse.redirect(new URL(next, origin));

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('OAuth callback exchangeCodeForSession:', error.message);
    return NextResponse.redirect(new URL('/login/', origin));
  }

  return response;
}
