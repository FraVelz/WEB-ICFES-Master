'use client';

import React from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useGamification, useGamificationScope } from '@/hooks/gamification';
import { AchievementsList } from '../components/AchievementsList';
import { LoadingState } from '@/shared/components/LoadingState';

export const UnifiedAchievementsPage = () => {
  const { loading: authLoading } = useAuth();
  const scope = useGamificationScope();
  const { achievements, loading, level, completedCount } = useGamification(scope);

  const showLoading = authLoading || (loading && achievements.length === 0);

  if (showLoading) {
    return <LoadingState label="Cargando logros..." layout="section" />;
  }

  return (
    <div className="relative z-10 mx-auto max-w-4xl space-y-6">
      <header className="space-y-1">
        <p className="text-on-surface-muted text-sm">
          Nivel {level} · {completedCount} de {achievements.length} logros
        </p>
      </header>

      <AchievementsList achievements={achievements} />
    </div>
  );
};
