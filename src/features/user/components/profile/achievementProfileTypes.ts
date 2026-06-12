import {
  sortAchievementsForDisplay,
  type AchievementDisplayItem,
} from '@/shared/constants/achievements/achievementGrouping';

export type ProfileAchievement = AchievementDisplayItem & {
  title: string;
  icon: string;
  status: string;
};

export const ACHIEVEMENT_STATUS_ORDER: Record<string, number> = {
  completed: 0,
  in_progress: 1,
  incomplete: 2,
};

export function sortAchievementsForProfile(achievements: ProfileAchievement[]): ProfileAchievement[] {
  return sortAchievementsForDisplay(achievements) as ProfileAchievement[];
}

/** En perfil solo se muestran logros con avance o ya desbloqueados. */
export function filterProfileVisibleAchievements(achievements: ProfileAchievement[]): ProfileAchievement[] {
  return achievements.filter(
    (achievement) => achievement.status === 'completed' || achievement.status === 'in_progress'
  );
}

export function achievementTileClass(status: string): string {
  if (status === 'completed') {
    return (
      'border-amber-500/35 bg-amber-50 text-amber-700 ' +
      'dark:border-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-400'
    );
  }
  if (status === 'in_progress') {
    return 'border-app-ring/40 bg-app-ring/10 text-app-accent-strong dark:text-app-accent';
  }
  return (
    'border-surface-border bg-surface-via/50 text-on-surface-muted opacity-60 grayscale ' +
    'dark:border-surface-border dark:bg-surface-overlay/50 dark:text-on-surface-muted'
  );
}
