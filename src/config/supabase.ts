/**
 * Cliente Supabase para el frontend (cookies vía @supabase/ssr; compatible con middleware).
 * RLS aplica con la sesión del usuario.
 */
import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

export { createServerSupabaseClient, createSupabaseClient, getSupabaseEnv } from './supabaseClient';

function createBrowserSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  if (!url || !key) return null;
  return createBrowserClient(url, key);
}

export const supabase = createBrowserSupabase();
