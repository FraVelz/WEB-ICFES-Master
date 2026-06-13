import { supabase } from '@/config/supabase';

async function getAccessToken(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

async function postJson<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const token = await getAccessToken();
  if (!token) throw new Error('Sesión no disponible');

  const response = await fetch(path, {
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

export async function awardAchievementsViaApi(achievementIds: string[]): Promise<{ awarded: string[] }> {
  const result = await postJson<{ awarded: string[]; skipped?: string[] }>('/api/achievements/reward/', {
    achievementIds,
  });
  return { awarded: result.awarded ?? [] };
}

export async function migrateDemoGamificationViaApi(xp: number, coins: number): Promise<void> {
  await postJson('/api/gamification/migrate-demo/', { xp, coins });
}
