import { ACHIEVEMENTS_DATA } from '@/shared/constants/achievementsData';
import type { AchievementProgressMap } from './achievementProgressTypes';

export function progressMapsEqual(a: AchievementProgressMap, b: AchievementProgressMap): boolean {
  for (const achievement of ACHIEVEMENTS_DATA) {
    const left = a[achievement.id];
    const right = b[achievement.id];
    if ((left?.current ?? 0) !== (right?.current ?? 0)) return false;
    if ((left?.unlocked ?? false) !== (right?.unlocked ?? false)) return false;
  }
  return true;
}

/** Fusiona dos mapas de logros tomando el mayor progreso y preservando desbloqueos previos. */
export function mergeAchievementProgressMaps(
  base: AchievementProgressMap,
  incoming: AchievementProgressMap
): AchievementProgressMap {
  const merged: AchievementProgressMap = { ...base };

  for (const achievement of ACHIEVEMENTS_DATA) {
    const a = base[achievement.id];
    const b = incoming[achievement.id];
    if (!a && !b) continue;

    const current = Math.max(a?.current ?? 0, b?.current ?? 0);
    const capped = Math.min(current, achievement.target);
    const unlocked = (a?.unlocked ?? false) || (b?.unlocked ?? false) || capped >= achievement.target;
    const unlockedTimestamps = [a?.unlockedAt, b?.unlockedAt]
      .filter(Boolean)
      .map((date) => new Date(date as string).getTime());
    const unlockedAt = unlocked
      ? unlockedTimestamps.length > 0
        ? new Date(Math.min(...unlockedTimestamps)).toISOString()
        : new Date().toISOString()
      : null;

    merged[achievement.id] = { current: capped, unlocked, unlockedAt };
  }

  return merged;
}
