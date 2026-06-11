import { supabase } from '@/config/supabase';

/** Headers de autenticación para fetch a APIs propias (Bearer + cookies demo automáticas). */
export async function getApiAuthHeaders(): Promise<HeadersInit> {
  const session = (await supabase?.auth.getSession())?.data?.session;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`;
  }

  return headers;
}
