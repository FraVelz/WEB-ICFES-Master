'use client';

import { useDashboardShell } from './DashboardShellContext';
import { LearningAsidePanels } from './LearningAsidePanels';
import { AchievementsAsidePanels } from './AchievementsAsidePanels';
import { LeaderboardAsidePanels } from './LeaderboardAsidePanels';
import { LecturaAsidePanels } from './LecturaAsidePanels';

export { LearningAsidePanels } from './LearningAsidePanels';
export { AchievementsAsidePanels } from './AchievementsAsidePanels';
export { LeaderboardAsidePanels } from './LeaderboardAsidePanels';
export { LecturaAsidePanels } from './LecturaAsidePanels';

export function DashboardShellAsidePanels() {
  const { shellSection } = useDashboardShell();

  switch (shellSection) {
    case 'learning':
      return <LearningAsidePanels />;
    case 'achievements':
      return <AchievementsAsidePanels />;
    case 'leaderboard':
      return <LeaderboardAsidePanels />;
    case 'lectura':
      return <LecturaAsidePanels />;
    default:
      return null;
  }
}
