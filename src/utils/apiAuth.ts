import type { NextRequest } from 'next/server';
import type { User } from '@supabase/supabase-js';
import { createServerSupabaseClient } from '@/config/supabaseClient';

export const DEMO_SESSION_COOKIE = 'icfes_demo';

export async function getAuthUserFromRequest(request: NextRequest): Promise<User | null> {
  const authHeader = request.headers.get('Authorization');
  const jwt = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!jwt) return null;

  const supabase = createServerSupabaseClient(jwt);
  if (!supabase) return null;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(jwt);

  if (error || !user) return null;
  return user;
}

export function hasDemoSession(request: NextRequest): boolean {
  return request.cookies.get(DEMO_SESSION_COOKIE)?.value === '1';
}

export function hasApiAccess(request: NextRequest, user: User | null): boolean {
  return Boolean(user) || hasDemoSession(request);
}
