'use client';

import React from 'react';
import { useGamification, useGamificationScope } from '@/hooks/gamification';
import { AchievementsList } from '../components/AchievementsList';
import { Icon } from '@/shared/components/Icon';
import { LoadingState } from '@/shared/components/LoadingState';

import { PAGE_SHELL_CLASS } from '@/shared/constants/pageShell';

export const UnifiedAchievementsPage = () => {
  const scope = useGamificationScope();
  const { achievements, loading, totalXP, level, completedCount } = useGamification(scope);

  if (loading) {
    return <LoadingState label="Cargando logros..." layout="fill" />;
  }

  return (
    <div className={PAGE_SHELL_CLASS}>
      <div className="container mx-auto space-y-8 px-4 py-8">
        {/* Stats Header */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="border-surface-border bg-surface-elevated/90 flex items-center gap-4 rounded-2xl border p-6 shadow-sm">
            <div className="bg-lesson-math-glow-a/20 flex h-12 w-12 items-center justify-center rounded-full text-xl text-yellow-400">
              <Icon name="trophy" />
            </div>
            <div>
              <p className="text-on-surface-muted text-sm">Nivel Actual</p>
              <p className="text-2xl font-bold">{level}</p>
            </div>
          </div>

          <div className="border-surface-border bg-surface-elevated/90 flex items-center gap-4 rounded-2xl border p-6 shadow-sm">
            <div className="bg-app-ring/20 text-app-accent flex h-12 w-12 items-center justify-center rounded-full text-xl">
              <Icon name="star" />
            </div>
            <div>
              <p className="text-on-surface-muted text-sm">Experiencia Total</p>
              <p className="text-2xl font-bold">{totalXP} XP</p>
            </div>
          </div>

          <div className="border-surface-border bg-surface-elevated/90 flex items-center gap-4 rounded-2xl border p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20 text-xl text-purple-400">
              <Icon name="medal" />
            </div>
            <div>
              <p className="text-on-surface-muted text-sm">Logros Completados</p>
              <p className="text-2xl font-bold">
                {completedCount} / {achievements.length}
              </p>
            </div>
          </div>
        </div>

        {/* Achievements List */}
        <AchievementsList achievements={achievements} />
      </div>
    </div>
  );
};
