'use client';

import React from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useGamification, useGamificationScope } from '@/hooks/gamification';
import { AchievementsList } from '../components/AchievementsList';
import { SkeletonGrid } from '@/shared/components/SkeletonCard';

export const UnifiedAchievementsPage = () => {
  const { loading: authLoading } = useAuth();
  const scope = useGamificationScope();
  const { achievements, loading, level, completedCount } = useGamification(scope);

  const showLoading = authLoading || (loading && achievements.length === 0);

  if (showLoading) {
    return (
      <div className="px-4 sm:px-6">
        <SkeletonGrid count={6} columnsClassName="grid-cols-1 md:grid-cols-2" />
      </div>
    );
  }

  return (
    <div className="relative z-10 w-full space-y-6 px-4 pb-4 sm:space-y-8 sm:px-6 sm:pb-6">
      <header className="space-y-1">
        <p className="text-on-surface-muted text-sm sm:text-base">
          Nivel {level} · {completedCount} de {achievements.length} logros
        </p>
      </header>

      <AchievementsList achievements={achievements} />
    </div>
  );
};
