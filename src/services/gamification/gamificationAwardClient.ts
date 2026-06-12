import { supabase } from '@/config/supabase';

async function getAccessToken(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

async function postAward<T>(body: Record<string, unknown>): Promise<T> {
  const token = await getAccessToken();
  if (!token) throw new Error('Sesión no disponible');

  const response = await fetch('/api/gamification/award/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const payload = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new Error(typeof payload.error === 'string' ? payload.error : 'No se pudo aplicar la recompensa');
  }

  return payload;
}

export async function awardXpViaApi(userId: string, points: number, reason: string): Promise<void> {
  void userId;
  await postAward({ type: 'xp', points, reason });
}

export async function awardCoinsViaApi(userId: string, amount: number, reason: string): Promise<void> {
  void userId;
  await postAward({ type: 'coins', amount, reason });
}

export async function spendCoinsViaApi(userId: string, amount: number, item: string): Promise<void> {
  void userId;
  await postAward({ type: 'spend_coins', amount, item });
}
