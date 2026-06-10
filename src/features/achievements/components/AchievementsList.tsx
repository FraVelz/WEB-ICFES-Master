'use client';

import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
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
        return 'border-cyan-700/45 bg-cyan-50 text-cyan-900 dark:border-amber-500/45 dark:bg-amber-500/15 dark:text-amber-300';
      case 'in_progress':
        return 'text-app-accent border-app-ring/50 bg-app-ring/10';
      default:
        return 'text-slate-500 border-slate-700 bg-slate-800/50';
    }
  };

  const getProgressBarColor = (status: string) => {
    if (status === 'completed') return 'bg-cyan-700 dark:bg-amber-500';
    if (status === 'incomplete') return 'bg-slate-600';
    return 'bg-hub-orb';
  };

  return (
    <div className="animate-fade-in w-full space-y-6">
      {/* Header & Filters */}
      <div className="space-y-4">
        <h2 className="from-hub-title-from bg-linear-to-r to-blue-400 bg-clip-text px-1 text-2xl font-bold text-transparent">
          Logros y Metas
        </h2>

        {/* Scrollable Categories */}
        <div className="scrollbar-hide -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
          {Object.entries(ACHIEVEMENT_CATEGORIES).map(([key, { label, icon }]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveCategory(key)}
              className={cn(
                'flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-300',
                'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                'focus-visible:ring-offset-slate-950',
                activeCategory === key
                  ? 'border-app-ring bg-app-ring/20 text-app-accent shadow-app-ring/20 shadow-lg'
                  : 'border-surface-border bg-surface-elevated text-on-surface-muted hover:border-app-ring/40 hover:text-on-surface dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:bg-slate-800'
              )}
            >
              <Icon name={icon} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAchievements.map((achievement: AchievementItem) => {
          const isCompleted = achievement.status === 'completed';
          const isIncomplete = achievement.status === 'incomplete';
          const percent = Math.min(100, Math.max(0, ((achievement.progress ?? 0) / (achievement.target ?? 1)) * 100));

          return (
            <div
              key={achievement.id}
              className={cn(
                'group relative overflow-hidden rounded-xl border p-4 transition-all duration-300',
                isCompleted
                  ? 'border-cyan-700/45 bg-white shadow-sm hover:border-cyan-800 dark:border-amber-500/35 dark:bg-slate-800/80 dark:shadow-none dark:hover:border-amber-500/55'
                  : isIncomplete
                    ? 'border-slate-800 bg-slate-900/50 opacity-75'
                    : 'hover:border-app-ring/30 border-slate-700 bg-slate-800/30 hover:bg-slate-800/50'
              )}
            >
              <div className="flex items-start gap-4">
                {/* Icon Box */}
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-lg border text-xl',
                    getStatusColor(achievement.status ?? 'incomplete')
                  )}
                >
                  <Icon name={achievement.icon ?? 'trophy'} />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-start justify-between">
                    <h3
                      className={cn(
                        'truncate pr-2 font-bold',
                        isCompleted ? 'text-cyan-900 dark:text-amber-50' : 'text-white'
                      )}
                    >
                      {achievement.title}
                    </h3>
                    {isCompleted && <Icon name="check" className="text-sm text-cyan-800 dark:text-amber-400" />}
                    {isIncomplete && <Icon name="lock" className="text-sm text-slate-600" />}
                  </div>

                  <p
                    className={cn(
                      'mb-3 line-clamp-2 text-xs',
                      isCompleted ? 'text-cyan-800/80 dark:text-slate-300' : 'text-slate-400'
                    )}
                  >
                    {achievement.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span
                        className={isCompleted ? 'font-semibold text-cyan-800 dark:text-amber-400' : 'text-app-ring/80'}
                      >
                        {isCompleted ? '¡Completado!' : `${achievement.progress ?? 0} / ${achievement.target ?? 0}`}
                      </span>
                      <span className={isCompleted ? 'text-cyan-700/75 dark:text-slate-400' : 'text-slate-500'}>
                        +{achievement.xpReward ?? 0} XP
                      </span>
                    </div>
                    <div
                      className={cn(
                        'h-1.5 w-full overflow-hidden rounded-full',
                        isCompleted ? 'bg-cyan-100 dark:bg-slate-950' : 'bg-slate-950'
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
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
