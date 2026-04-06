/**
 * Cliente Supabase para el frontend
 * Usa anon key para operaciones del cliente (RLS aplica)
 * Solo se crea cuando las variables de entorno están definidas (evita errores en build/SSR)
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
