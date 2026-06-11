import { ACHIEVEMENTS_DATA } from '@/shared/constants/achievementsData';
import type { AchievementMerged, AchievementProgressRecord } from './gamificationTypes';

export function mergeAchievements(achProgress: AchievementProgressRecord): AchievementMerged[] {
  return ACHIEVEMENTS_DATA.map((a) => {
    const p = achProgress[a.id] ?? {};
    const current = p.current ?? 0;
    const unlocked = p.unlocked ?? false;
    return {
      ...a,
      progress: current,
      unlockedAt: p.unlockedAt || null,
      status: unlocked ? 'completed' : current > 0 ? 'in_progress' : 'incomplete',
    };
  });
}

export function countCompletedAchievements(merged: AchievementMerged[]): number {
  return merged.filter((m) => m.status === 'completed').length;
}
