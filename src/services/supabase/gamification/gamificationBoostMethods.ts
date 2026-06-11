import { DOUBLE_XP_DURATION_MS } from '@/features/store/constants/doubleXp';
import { MAX_STREAK_SHIELDS } from '@/features/store/constants/streakShield';
import { ensureSupabase, GAMIFICATION_TABLE, mapFromDb } from './gamificationMappers';
import { getOrCreate } from './gamificationProfileMethods';

export async function setStreakShieldCount(userId: string, count: number): Promise<number> {
  await getOrCreate(userId);
  const normalized = Math.min(MAX_STREAK_SHIELDS, Math.max(0, count));
  const sb = ensureSupabase();
  const { data, error } = await sb
    .from(GAMIFICATION_TABLE)
    .update({
      streak_shield_count: normalized,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw new Error(`Error guardando protectores de racha: ${error.message}`);
  return mapFromDb(data as Record<string, unknown>)!.streakShieldCount;
}

export async function activateDoubleXp(userId: string): Promise<string> {
  const profile = await getOrCreate(userId);
  const now = Date.now();
  const current = profile.doubleXpExpiresAt ? new Date(profile.doubleXpExpiresAt).getTime() : 0;
  const base = Math.max(now, current);
  const expiresAt = new Date(base + DOUBLE_XP_DURATION_MS).toISOString();

  const sb = ensureSupabase();
  const { data, error } = await sb
    .from(GAMIFICATION_TABLE)
    .update({
      double_xp_expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw new Error(`Error activando Doble XP: ${error.message}`);
  return mapFromDb(data as Record<string, unknown>)!.doubleXpExpiresAt ?? expiresAt;
}
