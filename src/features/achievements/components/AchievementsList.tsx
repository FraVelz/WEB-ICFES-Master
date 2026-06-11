'use client';

import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { EmptyState } from '@/shared/components/EmptyState';
import { ACHIEVEMENT_CATEGORIES } from '@/shared/constants/achievementsData';

export interface AchievementItem {
  id: string;
  category?: string;
  status?: string;
  progress?: number;
  target?: number;
  title?: string;
  description?: string;
  icon?: string;
  xpReward?: number;
}

export interface AchievementsListProps {
  achievements?: AchievementItem[];
}

export const AchievementsList = ({ achievements = [] }: AchievementsListProps) => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredAchievements =
    activeCategory === 'all' ? achievements : achievements.filter((a) => a.category === activeCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          'border-cyan-700/45 bg-cyan-50 text-cyan-900 dark:border-amber-500/45 ' +
          'dark:bg-amber-500/15 dark:text-amber-300'
        );
      case 'in_progress':
        return 'text-app-accent border-app-ring/50 bg-app-ring/10';
      default:
        return 'text-on-surface-muted border-surface-border bg-surface-elevated/60';
    }
  };

  const getProgressBarColor = (status: string) => {
    if (status === 'completed') return 'bg-cyan-700 dark:bg-amber-500';
    if (status === 'incomplete') return 'bg-on-surface-muted';
    return 'bg-hub-orb';
  };

  return (
    <div className="animate-fade-in w-full min-w-0 space-y-6 sm:space-y-8">
      <div className="space-y-4 sm:space-y-5">
        <h2
          className={cn(
            'from-hub-title-from bg-linear-to-r to-blue-400 bg-clip-text px-0.5',
            'text-2xl font-bold text-transparent sm:text-3xl'
          )}
        >
          Logros y Metas
        </h2>

        <div className="scrollbar-hide -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:flex-wrap sm:gap-2.5 sm:overflow-visible sm:px-0">
          {Object.entries(ACHIEVEMENT_CATEGORIES).map(([key, { label, icon }]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveCategory(key)}
              className={cn(
                'flex shrink-0 cursor-pointer items-center gap-2 rounded-full border px-3.5 py-2',
                'text-sm font-semibold whitespace-nowrap transition-all duration-300 sm:px-4',
                'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
                'focus-visible:ring-offset-2 focus-visible:ring-offset-surface-via',
                activeCategory === key
                  ? 'border-app-ring bg-app-ring/20 text-app-accent shadow-app-ring/20 shadow-lg'
                  : cn(
                      'border-surface-border bg-surface-elevated text-on-surface-muted',
                      'hover:border-app-ring/40 hover:text-on-surface dark:border-surface-border',
                      'dark:bg-surface-overlay/50 dark:text-on-surface-muted dark:hover:border-surface-border dark:hover:bg-surface-overlay'
                    )
              )}
            >
              <Icon name={icon} className="shrink-0" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {filteredAchievements.length === 0 ? (
        <EmptyState
          icon="trophy"
          title="No hay logros en esta categoría"
          description="Prueba otra categoría o sigue estudiando para desbloquear metas."
          actionLabel="Ir a estudiar"
          actionHref="/ruta-aprendizaje"
        />
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
        {filteredAchievements.map((achievement: AchievementItem) => {
          const isCompleted = achievement.status === 'completed';
          const isIncomplete = achievement.status === 'incomplete';
          const percent = Math.min(100, Math.max(0, ((achievement.progress ?? 0) / (achievement.target ?? 1)) * 100));

          return (
            <article
              key={achievement.id}
              className={cn(
                'group flex min-w-0 flex-col gap-4 rounded-2xl border p-5 transition-all duration-300 sm:p-6',
                isCompleted
                  ? cn(
                      'border-cyan-700/45 bg-white shadow-sm hover:border-cyan-800',
                      'dark:border-amber-500/35 dark:bg-surface-overlay/80 dark:shadow-none',
                      'dark:hover:border-amber-500/55'
                    )
                  : isIncomplete
                    ? 'border-surface-border bg-surface-elevated/50 opacity-80'
                    : 'hover:border-app-ring/30 border-surface-border bg-surface-overlay/30 hover:bg-surface-overlay/50'
              )}
            >
              <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                <div
                  className={cn(
                    'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border sm:h-14 sm:w-14',
                    getStatusColor(achievement.status ?? 'incomplete')
                  )}
                >
                  <Icon name={achievement.icon ?? 'trophy'} className="text-xl sm:text-2xl" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className={cn(
                        'line-clamp-2 text-base leading-snug font-bold sm:text-lg',
                        isCompleted ? 'text-cyan-900 dark:text-amber-50' : 'text-on-surface'
                      )}
                    >
                      {achievement.title}
                    </h3>
                    {isCompleted && (
                      <Icon name="check" className="mt-0.5 shrink-0 text-sm text-cyan-800 dark:text-amber-400" />
                    )}
                    {isIncomplete && (
                      <Icon name="lock" className="mt-0.5 shrink-0 text-sm text-on-surface-muted" />
                    )}
                  </div>
                </div>
              </div>

              <p
                className={cn(
                  'line-clamp-3 text-sm leading-relaxed',
                  isCompleted ? 'text-cyan-800/80 dark:text-on-surface-muted' : 'text-on-surface-muted'
                )}
              >
                {achievement.description}
              </p>

              <div className="mt-auto space-y-2">
                <div className="flex items-center justify-between gap-3 text-xs font-medium sm:text-sm">
                  <span
                    className={isCompleted ? 'font-semibold text-cyan-800 dark:text-amber-400' : 'text-app-accent-strong'}
                  >
                    {isCompleted ? '¡Completado!' : `${achievement.progress ?? 0} / ${achievement.target ?? 0}`}
                  </span>
                  <span className={isCompleted ? 'text-cyan-700/75 dark:text-on-surface-muted' : 'text-on-surface-muted'}>
                    +{achievement.xpReward ?? 0} XP
                  </span>
                </div>
                <div
                  role="progressbar"
                  aria-valuenow={Math.round(percent)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Progreso de ${achievement.title}`}
                  className={cn(
                    'h-2 w-full overflow-hidden rounded-full',
                    isCompleted ? 'bg-cyan-100 dark:bg-surface-via' : 'bg-surface-via'
                  )}
                >
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      getProgressBarColor(achievement.status ?? 'incomplete')
                    )}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
