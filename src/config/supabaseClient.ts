import { createClient, type SupabaseClient, type SupabaseClientOptions } from '@supabase/supabase-js';

export function getSupabaseEnv(): { url: string; key: string } {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  };
}

export function createSupabaseClient(options?: SupabaseClientOptions<'public'>): SupabaseClient | null {
  const { url, key } = getSupabaseEnv();
  if (!url || !key) return null;
  return createClient(url, key, options);
}

/** Cliente para Server Components, Route Handlers o scripts sin persistencia de sesión en browser. */
export function createServerSupabaseClient(accessToken?: string): SupabaseClient | null {
  if (!accessToken) return createSupabaseClient();

  return createSupabaseClient({
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}
