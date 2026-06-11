import type { GamificationProfile } from './gamificationTypes';
import { ensureSupabase, GAMIFICATION_TABLE, mapFromDb } from './gamificationMappers';
import { getOrCreate } from './gamificationProfileMethods';

export async function getStreak(
  userId: string
): Promise<{ dates: string[]; longestStreak: number }> {
  const profile = await getOrCreate(userId);
  return {
    dates: profile.streakDates ?? [],
    longestStreak: profile.longestStreak ?? 0,
  };
}

export async function updateStreak(
  userId: string,
  state: { dates: string[]; longestStreak: number }
): Promise<GamificationProfile> {
  await getOrCreate(userId);
  const sb = ensureSupabase();
  const payload = {
    user_id: userId,
    streak_dates: state.dates,
    longest_streak: state.longestStreak,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await sb
    .from(GAMIFICATION_TABLE)
    .upsert(payload, { onConflict: 'user_id' })
    .select()
    .single();
  if (error) throw new Error(`Error guardando racha: ${error.message}`);
  return mapFromDb(data as Record<string, unknown>)!;
}

export async function updateAchievements(
  userId: string,
  achievements: Record<string, unknown>
): Promise<GamificationProfile> {
  await getOrCreate(userId);
  const sb = ensureSupabase();
  const { data, error } = await sb
    .from(GAMIFICATION_TABLE)
    .update({ achievements, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw new Error(`Error actualizando logros: ${error.message}`);
  return mapFromDb(data as Record<string, unknown>)!;
}
