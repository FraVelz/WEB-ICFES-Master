import { syncAchievementsFromGameplay } from '@/services/achievements/achievementProgressService';
import { notifyGamificationUpdatedIfNeeded } from '@/services/achievements/gamificationUpdatedEvents';
import { DEMO_USER_ID } from '@/services/demo/demoCoins';
import { resolveStreakScopeFromStorage } from '@/services/streak/streakService';

export function syncAchievementsAfterGameplay(): void {
  const scope = resolveStreakScopeFromStorage();
  if (!scope) return;
  const userId = scope === 'demo' ? DEMO_USER_ID : scope;
  void syncAchievementsFromGameplay(userId).then(({ progressChanged, hadNewUnlocks }) => {
    notifyGamificationUpdatedIfNeeded({ progressChanged, hadNewUnlocks });
  });
}
