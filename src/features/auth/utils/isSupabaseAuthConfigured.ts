import { supabase } from '@/config/supabase';
import { isSupabaseConfigured } from '@/services/persistence/supabaseConfigured';

/** True when Supabase Auth can run (env vars + client). */
export function isSupabaseAuthConfigured(): boolean {
  return isSupabaseConfigured() && supabase !== null;
}
