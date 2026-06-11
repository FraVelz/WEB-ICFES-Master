export type ProfileAchievement = {
  id: string;
  title: string;
  description?: string;
  icon: string;
  status: string;
  progress?: number;
  target?: number;
};

export const ACHIEVEMENT_STATUS_ORDER: Record<string, number> = {
  completed: 0,
  in_progress: 1,
  incomplete: 2,
};

export function sortAchievementsForProfile(achievements: ProfileAchievement[]): ProfileAchievement[] {
  return [...achievements].sort(
    (a, b) => (ACHIEVEMENT_STATUS_ORDER[a.status] ?? 3) - (ACHIEVEMENT_STATUS_ORDER[b.status] ?? 3)
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
    'dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-600'
  );
}
