'use client';

import React, { useState } from 'react';
import { Icon } from '@/shared/components/Icon';
import { ACHIEVEMENT_CATEGORIES } from '../constants/achievements';

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
    activeCategory === 'all'
      ? achievements
      : achievements.filter((a) => a.category === activeCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10';
      case 'in_progress':
        return 'text-cyan-400 border-cyan-500/50 bg-cyan-500/10';
      default:
        return 'text-slate-500 border-slate-700 bg-slate-800/50';
    }
  };

  const getProgressBarColor = (status: string) => {
    if (status === 'completed') return 'bg-yellow-400';
    if (status === 'incomplete') return 'bg-slate-600';
    return 'bg-cyan-400';
  };

  return (
    <div className="animate-fade-in w-full space-y-6">
      {/* Header & Filters */}
      <div className="space-y-4">
        <h2 className="bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text px-1 text-2xl font-bold text-transparent">
          Logros y Metas
        </h2>

        {/* Scrollable Categories */}
        <div className="scrollbar-hide -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
          {Object.entries(ACHIEVEMENT_CATEGORIES).map(
            ([key, { label, icon }]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                  activeCategory === key
                    ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600 hover:bg-slate-800'
                }`}
              >
                <Icon name={icon} />
                {label}
              </button>
            )
          )}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAchievements.map((achievement: AchievementItem) => {
          const isCompleted = achievement.status === 'completed';
          const isIncomplete = achievement.status === 'incomplete';
          const percent = Math.min(
            100,
            Math.max(0, ((achievement.progress ?? 0) / (achievement.target ?? 1)) * 100)
          );

          return (
            <div
              key={achievement.id}
              className={`group relative overflow-hidden rounded-xl border p-4 transition-all duration-300 ${
                isCompleted
                  ? 'border-yellow-500/30 bg-linear-to-br from-yellow-500/10 to-orange-500/5 hover:border-yellow-500/50'
                  : isIncomplete
                    ? 'border-slate-800 bg-slate-900/50 opacity-75'
                    : 'border-slate-700 bg-slate-800/30 hover:border-cyan-500/30 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon Box */}
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg border text-xl ${getStatusColor(achievement.status ?? 'incomplete')}`}
                >
                  <Icon name={achievement.icon ?? 'trophy'} />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-start justify-between">
                    <h3
                      className={`truncate pr-2 font-bold ${isCompleted ? 'text-yellow-100' : 'text-white'}`}
                    >
                      {achievement.title}
                    </h3>
                    {isCompleted && (
                      <Icon name="check" className="text-sm text-yellow-400" />
                    )}
                    {isIncomplete && (
                      <Icon name="lock" className="text-sm text-slate-600" />
                    )}
                  </div>

                  <p className="mb-3 line-clamp-2 text-xs text-slate-400">
                    {achievement.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span
                        className={
                          isCompleted
                            ? 'text-yellow-500/80'
                            : 'text-cyan-500/80'
                        }
                      >
                        {isCompleted
                          ? '¡Completado!'
                          : `${achievement.progress ?? 0} / ${achievement.target ?? 0}`}
                      </span>
                      <span className="text-slate-500">
                        +{achievement.xpReward ?? 0} XP
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-950">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(achievement.status ?? 'incomplete')}`}
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
