import type { AchievementProgressMap } from './achievementProgressTypes';

function progressStorageKey(userId: string): string {
  return `icfes_achievement_progress_${userId}`;
}

export function normalizeAchievementsRecord(raw: unknown): AchievementProgressMap {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return {};
  return raw as AchievementProgressMap;
}

export function readAchievementProgress(userId: string): AchievementProgressMap {
  if (typeof window === 'undefined') return {};

  const stored = localStorage.getItem(progressStorageKey(userId));
  if (!stored) return {};

  try {
    return normalizeAchievementsRecord(JSON.parse(stored));
  } catch {
    return {};
  }
}

export function writeAchievementProgress(userId: string, progress: AchievementProgressMap): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(progressStorageKey(userId), JSON.stringify(progress));
}
