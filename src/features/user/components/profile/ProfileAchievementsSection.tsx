'use client';

import { useState } from 'react';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';

type Achievement = {
  id: string;
  title: string;
  description?: string;
  icon: string;
  status: string;
  progress?: number;
  target?: number;
};

type ProfileAchievementsSectionProps = {
  achievements: Achievement[];
  showViewAll?: boolean;
  onViewAll?: () => void;
};

const STATUS_ORDER: Record<string, number> = {
  completed: 0,
  in_progress: 1,
  incomplete: 2,
};

function sortAchievementsForProfile(achievements: Achievement[]): Achievement[] {
  return [...achievements].sort((a, b) => (STATUS_ORDER[a.status] ?? 3) - (STATUS_ORDER[b.status] ?? 3));
}

function achievementTileClass(status: string): string {
  if (status === 'completed') {
    return 'border-amber-500/35 bg-amber-50 text-amber-700 dark:border-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-400';
  }
  if (status === 'in_progress') {
    return 'border-app-ring/40 bg-app-ring/10 text-app-accent-strong dark:text-app-accent';
  }
  return 'border-surface-border bg-surface-via/50 text-on-surface-muted opacity-60 grayscale dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-600';
}

function AchievementStatusLabel({ status }: { status: string }) {
  if (status === 'completed') {
    return <span className="text-xs font-semibold text-amber-700 dark:text-yellow-400">Desbloqueado</span>;
  }
  if (status === 'in_progress') {
    return <span className="text-app-accent-strong dark:text-app-accent text-xs font-semibold">En progreso</span>;
  }
  return <span className="text-on-surface-muted text-xs font-medium">Bloqueado</span>;
}

function AchievementGridTile({ achievement }: { achievement: Achievement }) {
  const isUnlocked = achievement.status === 'completed';
  const iconName = typeof achievement.icon === 'string' ? achievement.icon : 'star';

  return (
    <div className="group relative">
      <div
        className={cn(
          'relative flex aspect-square flex-col items-center justify-center rounded-xl border p-2 transition-all',
          achievementTileClass(achievement.status),
          'md:cursor-help'
        )}
        aria-label={achievement.title}
      >
        <Icon name={iconName} className="mb-1 text-2xl" />
        {isUnlocked && (
          <Icon
            name="star"
            size="sm"
            className="absolute top-2 right-2 text-[8px] text-amber-500 dark:text-yellow-200"
          />
        )}
      </div>

      <div
        role="tooltip"
        className={cn(
          'border-surface-border bg-surface-elevated pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 hidden w-52 -translate-x-1/2 rounded-xl border p-3 text-left shadow-xl',
          'opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100',
          'dark:border-slate-700 dark:bg-slate-900',
          'max-md:hidden'
        )}
      >
        <p className="text-on-surface text-sm font-semibold">{achievement.title}</p>
        {achievement.description && (
          <p className="text-on-surface-muted mt-1 text-xs leading-relaxed">{achievement.description}</p>
        )}
        <div className="mt-2">
          <AchievementStatusLabel status={achievement.status} />
        </div>
      </div>
    </div>
  );
}

function AchievementDetailRow({ achievement }: { achievement: Achievement }) {
  const iconName = typeof achievement.icon === 'string' ? achievement.icon : 'star';
  const showProgress =
    achievement.status === 'in_progress' &&
    typeof achievement.progress === 'number' &&
    typeof achievement.target === 'number' &&
    achievement.target > 0;

  return (
    <li
      className={cn(
        'border-surface-border flex gap-3 rounded-xl border p-3',
        'bg-surface-via/40 dark:border-slate-800 dark:bg-slate-800/40',
        achievement.status === 'completed' && 'border-amber-500/25 dark:border-yellow-500/20'
      )}
    >
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border',
          achievementTileClass(achievement.status)
        )}
      >
        <Icon name={iconName} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-on-surface text-sm font-semibold">{achievement.title}</p>
          <AchievementStatusLabel status={achievement.status} />
        </div>
        {achievement.description && (
          <p className="text-on-surface-muted mt-1 text-xs leading-relaxed">{achievement.description}</p>
        )}
        {showProgress && (
          <p className="text-on-surface-muted mt-1 text-xs">
            Progreso: {achievement.progress} / {achievement.target}
          </p>
        )}
      </div>
    </li>
  );
}

export function ProfileAchievementsSection({ achievements, showViewAll, onViewAll }: ProfileAchievementsSectionProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const sortedAchievements = sortAchievementsForProfile(achievements);
  const visibleAchievements = sortedAchievements.slice(0, 9);
  const completedCount = achievements.filter((achievement) => achievement.status === 'completed').length;

  return (
    <div
      className={cn(
        'border-surface-border bg-surface-elevated/80 sticky top-24 rounded-2xl border p-6 shadow-sm',
        'dark:border-slate-800 dark:bg-slate-900/50'
      )}
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-on-surface flex items-center gap-3 text-xl font-bold">
            <Icon name="trophy" className="text-amber-600 dark:text-yellow-400" />
            Logros
          </h2>
          {achievements.length > 0 && (
            <p className="text-on-surface-muted mt-1 text-xs">
              {completedCount} de {achievements.length} desbloqueados
            </p>
          )}
        </div>
        {showViewAll && onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-app-accent-strong hover:text-app-accent dark:text-app-accent dark:hover:text-app-accent-muted cursor-pointer text-xs font-bold tracking-wider uppercase"
          >
            Ver todos
          </button>
        )}
      </div>

      {visibleAchievements.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-3">
            {visibleAchievements.map((achievement) => (
              <AchievementGridTile key={achievement.id} achievement={achievement} />
            ))}
          </div>

          <p className="text-on-surface-muted mt-3 hidden text-center text-[11px] md:block">
            Pasa el cursor sobre un icono para ver el detalle.
          </p>

          <button
            type="button"
            onClick={() => setDetailsOpen((open) => !open)}
            aria-expanded={detailsOpen}
            className={cn(
              'border-surface-border bg-surface-via/60 text-on-surface mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-2.5',
              'hover:bg-surface-via text-sm font-semibold transition-colors',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              'focus-visible:ring-offset-surface dark:border-slate-700 dark:bg-slate-800/60 dark:hover:bg-slate-800',
              'md:mt-3'
            )}
          >
            <Icon name={detailsOpen ? 'chevron-up' : 'info-circle'} size="sm" />
            {detailsOpen ? 'Ocultar detalles' : 'Más información'}
          </button>

          {detailsOpen && (
            <ul className="mt-4 max-h-80 space-y-2 overflow-y-auto pr-1 md:max-h-96">
              {visibleAchievements.map((achievement) => (
                <AchievementDetailRow key={achievement.id} achievement={achievement} />
              ))}
            </ul>
          )}
        </>
      )}

      {achievements.length === 0 && (
        <p className="text-on-surface-muted py-4 text-center text-sm">
          {showViewAll ? 'Completa lecciones para desbloquear logros.' : 'Sin logros desbloqueados aún.'}
        </p>
      )}
    </div>
  );
}
