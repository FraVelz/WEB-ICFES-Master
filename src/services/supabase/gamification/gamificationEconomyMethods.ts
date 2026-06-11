import { countsForWeeklyLeagueXp } from '@/shared/constants/gamification';
import { isDoubleXpActive } from '@/features/store/constants/doubleXp';
import type { GamificationProfile } from './gamificationTypes';
import { ensureSupabase, GAMIFICATION_TABLE, mapFromDb } from './gamificationMappers';
import { getByUserId, getOrCreate } from './gamificationProfileMethods';

export async function addXP(
  userId: string,
  points: number,
  reason = 'activity'
): Promise<GamificationProfile> {
  const profile = await getOrCreate(userId);
  const multiplier = isDoubleXpActive(profile.doubleXpExpiresAt) ? 2 : 1;
  const awardedPoints = points * multiplier;
  const newXP = (profile.xp || 0) + awardedPoints;
  const xpHistory = [
    ...(profile.xpHistory || []),
    {
      date: new Date().toISOString(),
      points: awardedPoints,
      basePoints: points,
      multiplier,
      reason,
    },
  ];

  const payload = {
    user_id: userId,
    xp: newXP,
    xp_history: xpHistory,
    updated_at: new Date().toISOString(),
  };
  const sb = ensureSupabase();
  const { data, error } = await sb
    .from(GAMIFICATION_TABLE)
    .upsert(payload, { onConflict: 'user_id' })
    .select()
    .single();
  if (error) throw new Error(`Error añadiendo XP: ${error.message}`);

  if (countsForWeeklyLeagueXp(reason)) {
    const { error: weeklyError } = await sb.rpc('add_weekly_xp', {
      p_user_id: userId,
      p_points: awardedPoints,
    });
    if (weeklyError) {
      console.warn('No se pudo sumar XP semanal de liga:', weeklyError.message);
    }
  }

  return (await getByUserId(userId)) ?? mapFromDb(data as Record<string, unknown>)!;
}

export async function addCoins(
  userId: string,
  amount: number,
  reason = 'reward'
): Promise<GamificationProfile> {
  const profile = await getOrCreate(userId);
  const newTotalCoins = (profile.totalCoins || 0) + amount;
  const coinsHistory = [
    ...(profile.coinsHistory || []),
    { date: new Date().toISOString(), amount, reason, type: 'earn' },
  ];

  const payload = {
    user_id: userId,
    total_coins: newTotalCoins,
    coins_history: coinsHistory,
    updated_at: new Date().toISOString(),
  };
  const sb = ensureSupabase();
  const { data, error } = await sb
    .from(GAMIFICATION_TABLE)
    .upsert(payload, { onConflict: 'user_id' })
    .select()
    .single();
  if (error) throw new Error(`Error añadiendo monedas: ${error.message}`);
  return mapFromDb(data as Record<string, unknown>)!;
}

export async function spendCoins(
  userId: string,
  amount: number,
  item = 'purchase'
): Promise<GamificationProfile> {
  const profile = await getOrCreate(userId);
  const available = (profile.totalCoins || 0) - (profile.spentCoins || 0);
  if (available < amount) throw new Error('Monedas insuficientes');
  const newSpent = (profile.spentCoins || 0) + amount;
  const coinsHistory = [
    ...(profile.coinsHistory || []),
    { date: new Date().toISOString(), amount, item, type: 'spend' },
  ];

  const payload = {
    user_id: userId,
    spent_coins: newSpent,
    coins_history: coinsHistory,
    updated_at: new Date().toISOString(),
  };
  const sb = ensureSupabase();
  const { data, error } = await sb
    .from(GAMIFICATION_TABLE)
    .update(payload)
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw new Error(`Error gastando monedas: ${error.message}`);
  return mapFromDb(data as Record<string, unknown>)!;
}
