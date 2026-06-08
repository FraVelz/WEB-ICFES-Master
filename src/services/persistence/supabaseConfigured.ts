import { supabase } from '@/config/supabase';

/** True when Supabase client env vars are present and the browser client was created. */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      supabase
  );
}
