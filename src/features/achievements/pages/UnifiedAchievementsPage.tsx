'use client';

import React, { useMemo } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useGamificationContext } from '@/hooks/gamification/GamificationContext';
import { getAchievementChainSummary } from '@/shared/constants/achievements/achievementChainDisplay';
import { AchievementsList } from '../components/AchievementsList';
import { SkeletonGrid } from '@/shared/components/SkeletonCard';

export const UnifiedAchievementsPage = () => {
  const { loading: authLoading } = useAuth();
  const { achievements, loading, level } = useGamificationContext();
  const summary = useMemo(() => getAchievementChainSummary(achievements), [achievements]);

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
        <h1 className="text-on-surface text-xl font-bold sm:text-2xl">Logros</h1>
        <p className="text-on-surface-muted text-sm sm:text-base">
          Nivel {level} · {summary.completedTiers} de {summary.totalTiers} escalones · {summary.totalChains} metas
        </p>
      </header>

      <AchievementsList achievements={achievements} />
    </div>
  );
};
