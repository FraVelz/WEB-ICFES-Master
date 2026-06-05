export type StreakScope = 'demo' | string;

export type StreakState = {
  dates: string[];
  longestStreak: number;
};

export const STREAK_UPDATED_EVENT = 'icfes-streak-updated';

export const DEMO_STREAK_KEY = 'icfes_streak_dates';

export function getUserStreakKey(userId: string): string {
  return `icfes_streak_dates_${userId}`;
}

export function getStreakScope(userId?: string | null, isDemo?: boolean): StreakScope | null {
  if (userId && userId !== 'demo') return userId;
  if (isDemo || userId === 'demo') return 'demo';
  return null;
}

export function resolveStorageKey(scope: StreakScope): string {
  return scope === 'demo' ? DEMO_STREAK_KEY : getUserStreakKey(scope);
}
