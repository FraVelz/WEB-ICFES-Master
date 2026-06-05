'use client';

import React from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useGamification } from '@/hooks/gamification';
import { AchievementsList } from '../components/AchievementsList';
import { Icon } from '@/shared/components/Icon';
import { LoadingState } from '@/shared/components/LoadingState';

export const UnifiedAchievementsPage = () => {
  const { user } = useAuth();
  const { achievements, loading, totalXP, level, completedCount } = useGamification(user?.uid);

  if (loading) {
    return <LoadingState label="Cargando logros..." layout="page" />;
  }

  return (
    <div className="min-h-dvh bg-slate-950 pb-24 text-white md:pb-0">
      <div className="container mx-auto space-y-8 px-4 py-8">
        {/* Stats Header */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="bg-lesson-math-glow-a/20 flex h-12 w-12 items-center justify-center rounded-full text-xl text-yellow-400">
              <Icon name="trophy" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Nivel Actual</p>
              <p className="text-2xl font-bold">{level}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="bg-app-ring/20 text-app-accent flex h-12 w-12 items-center justify-center rounded-full text-xl">
              <Icon name="star" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Experiencia Total</p>
              <p className="text-2xl font-bold">{totalXP} XP</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20 text-xl text-purple-400">
              <Icon name="medal" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Logros Completados</p>
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
