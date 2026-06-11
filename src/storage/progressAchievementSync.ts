import { syncAchievementsFromGameplay } from '@/services/achievements/achievementProgressService';
import { DEMO_USER_ID } from '@/services/demo/demoCoins';
import { STREAK_UPDATED_EVENT } from '@/services/streak';
import { resolveStreakScopeFromStorage } from '@/services/streak/streakService';

export function syncAchievementsAfterGameplay(): void {
  const scope = resolveStreakScopeFromStorage();
  if (!scope) return;
  const userId = scope === 'demo' ? DEMO_USER_ID : scope;
  void syncAchievementsFromGameplay(userId).then(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(STREAK_UPDATED_EVENT));
    }
  });
}
