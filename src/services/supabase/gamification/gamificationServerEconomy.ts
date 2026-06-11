import { countsForWeeklyLeagueXp } from '@/shared/constants/gamification';
import { createServiceRoleClient } from '@/config/supabaseServiceRole';
import { GAMIFICATION_TABLE, mapFromDb } from './gamificationMappers';
type HistoryEntry = { reason?: string };

function hasHistoryReason(history: unknown, reason: string): boolean {
  if (!Array.isArray(history)) return false;
  return history.some((entry) => {
    if (!entry || typeof entry !== 'object') return false;
    return (entry as HistoryEntry).reason === reason;
  });
}

async function getProfileRow(userId: string) {
  const sb = createServiceRoleClient();
  if (!sb) throw new Error('Supabase service role no configurado');

  const { data, error } = await sb.from(GAMIFICATION_TABLE).select('*').eq('user_id', userId).maybeSingle();
  if (error) throw new Error(`Error leyendo gamificación: ${error.message}`);
  return { sb, profile: mapFromDb(data as Record<string, unknown> | null) };
}

/** Otorga XP en servidor con idempotencia por `reason`. Solo para Route Handlers. */
export async function addXpServer(
  userId: string,
  points: number,
  reason: string
): Promise<{ awarded: boolean; xp: number }> {
  if (points <= 0) return { awarded: false, xp: 0 };

  const { sb, profile } = await getProfileRow(userId);
  const currentXp = profile?.xp ?? 0;

  if (hasHistoryReason(profile?.xpHistory, reason)) {
    return { awarded: false, xp: currentXp };
  }

  const newXP = currentXp + points;
  const xpHistory = [
    ...(profile?.xpHistory ?? []),
    { date: new Date().toISOString(), points, basePoints: points, multiplier: 1, reason },
  ];

  const { error } = await sb
    .from(GAMIFICATION_TABLE)
    .upsert(
      { user_id: userId, xp: newXP, xp_history: xpHistory, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    );

  if (error) throw new Error(`Error añadiendo XP: ${error.message}`);

  if (countsForWeeklyLeagueXp(reason)) {
    const { error: weeklyError } = await sb.rpc('add_weekly_xp', { p_user_id: userId, p_points: points });
    if (weeklyError) console.warn('No se pudo sumar XP semanal de liga:', weeklyError.message);
  }

  return { awarded: true, xp: newXP };
}

/** Otorga monedas en servidor con idempotencia por `reason`. Solo para Route Handlers. */
export async function addCoinsServer(
  userId: string,
  amount: number,
  reason: string
): Promise<{ awarded: boolean; coins: number }> {
  if (amount <= 0) return { awarded: false, coins: 0 };

  const { sb, profile } = await getProfileRow(userId);
  const totalCoins = profile?.totalCoins ?? 0;
  const spentCoins = profile?.spentCoins ?? 0;

  if (hasHistoryReason(profile?.coinsHistory, reason)) {
    return { awarded: false, coins: totalCoins - spentCoins };
  }

  const newTotalCoins = totalCoins + amount;
  const coinsHistory = [
    ...(profile?.coinsHistory ?? []),
    { date: new Date().toISOString(), amount, reason, type: 'earn' },
  ];

  const { error } = await sb.from(GAMIFICATION_TABLE).upsert(
    {
      user_id: userId,
      total_coins: newTotalCoins,
      coins_history: coinsHistory,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );

  if (error) throw new Error(`Error añadiendo monedas: ${error.message}`);

  return { awarded: true, coins: newTotalCoins - spentCoins };
}

export async function hasRewardReason(userId: string, reason: string): Promise<boolean> {
  const { profile } = await getProfileRow(userId);
  return hasHistoryReason(profile?.xpHistory, reason) || hasHistoryReason(profile?.coinsHistory, reason);
}
