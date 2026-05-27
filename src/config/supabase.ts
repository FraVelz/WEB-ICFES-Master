/**
 * Cliente Supabase para el frontend
 * Usa anon key para operaciones del cliente (RLS aplica)
 * Solo se crea cuando las variables de entorno están definidas (evita errores en build/SSR)
 */
import { createSupabaseClient } from './supabaseClient';

export { createServerSupabaseClient, createSupabaseClient, getSupabaseEnv } from './supabaseClient';

export const supabase = createSupabaseClient({
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
