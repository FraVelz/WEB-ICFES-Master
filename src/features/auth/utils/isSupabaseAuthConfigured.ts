import { supabase } from '@/config/supabase';
import { isSupabaseMode } from '@/services/persistence/apiMode';

/** True when Supabase Auth can run (env vars + client + supabase API mode). */
export function isSupabaseAuthConfigured(): boolean {
  return (
    isSupabaseMode() &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) &&
    supabase !== null
  );
}
