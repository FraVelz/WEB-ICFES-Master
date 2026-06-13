import { supabase } from '@/config/supabase';

async function getAccessToken(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export async function spendCoinsViaApi(userId: string, amount: number, item: string): Promise<void> {
  void userId;
  const token = await getAccessToken();
  if (!token) throw new Error('Sesión no disponible');

  const response = await fetch('/api/gamification/award/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type: 'spend_coins', amount, item }),
  });

  const payload = (await response.json()) as { error?: string };
  if (!response.ok) {
    throw new Error(typeof payload.error === 'string' ? payload.error : 'No se pudo aplicar la recompensa');
  }
}
