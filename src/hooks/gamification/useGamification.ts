/**
 * Hook de gamificación — Supabase para cuentas; demo usa almacenamiento local de demo.
 */
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DEMO_USER_ID, getDemoCoins } from '@/services/demo/demoCoins';
import { getDemoTotalXP } from '@/services/demo/demoGamification';
import { calculateLevel } from '@/services/gamification/gamificationUtils';
import {
  readAchievementProgress,
  type AchievementProgressMap,
} from '@/services/achievements/achievementProgressService';
import { getStreakMetrics, loadLocalStreakState, STREAK_UPDATED_EVENT, type StreakScope } from '@/services/streak';
import { queryKeys } from '@/services/query/queryKeys';
import { countCompletedAchievements, mergeAchievements } from './gamificationAchievementMerge';
import { syncStreakAchievement } from './gamificationStreakSync';
import { updateAchievementProgressForUser } from './gamificationUpdateProgress';
import { fetchGamificationBundle } from './gamificationQuery';
import type { AchievementMerged } from './gamificationTypes';

/** `userId` real o `'demo'` para racha sin cuenta. */
export const useGamification = (scope: StreakScope | undefined) => {
  const queryClient = useQueryClient();
  const [achievements, setAchievements] = useState<AchievementMerged[]>([]);
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [completedCount, setCompletedCount] = useState(0);
  const [streak, setStreak] = useState<string[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const lastSyncedStreak = useRef(0);

  const isDemoScope = scope === 'demo';
  const accountUserId = scope && scope !== 'demo' ? scope : undefined;
  const queryKey = scope ? queryKeys.gamification(scope) : ['gamification', 'none'];

  const applyMergedAchievements = useCallback((achProgress: AchievementProgressMap) => {
    const merged = mergeAchievements(achProgress);
    setAchievements(merged);
    setCompletedCount(countCompletedAchievements(merged));
  }, []);

  const applyBundle = useCallback((bundle: Awaited<ReturnType<typeof fetchGamificationBundle>>) => {
    setAchievements(bundle.achievements);
    setCompletedCount(bundle.completedCount);
    setCoins(bundle.coins);
    setTotalXP(bundle.totalXP);
    setLevel(bundle.level);
    setStreak(bundle.streak);
    setCurrentStreak(bundle.currentStreak);
    setLongestStreak(bundle.longestStreak);
    setLoading(false);
  }, []);

  const { data, isLoading, refetch } = useQuery({
    queryKey,
    queryFn: () => fetchGamificationBundle(scope!),
    enabled: !!scope,
  });

  useEffect(() => {
    if (!scope) {
      setLoading(false);
      return;
    }

    const achievementUserId = accountUserId ?? (isDemoScope ? DEMO_USER_ID : null);

    const streakState = loadLocalStreakState(scope);
    const metrics = getStreakMetrics(streakState);
    setStreak(metrics.dates);
    setCurrentStreak(metrics.currentStreak);
    setLongestStreak(metrics.longestStreak);

    if (isDemoScope) {
      setCoins(getDemoCoins());
      const demoXP = getDemoTotalXP();
      setTotalXP(demoXP);
      setLevel(calculateLevel(demoXP));
    }

    if (!achievementUserId) return;

    const cached = readAchievementProgress(achievementUserId);
    if (Object.keys(cached).length === 0) return;

    applyMergedAchievements(cached);
    setLoading(false);
  }, [scope, accountUserId, isDemoScope, applyMergedAchievements]);

  useEffect(() => {
    if (!data) return;
    applyBundle(data);
    if (accountUserId && data.longestStreak > 0) {
      void syncStreakAchievement(accountUserId, data.longestStreak, lastSyncedStreak);
    }
  }, [data, applyBundle, accountUserId]);

  useEffect(() => {
    if (!scope) return;
    if (isLoading && !data) {
      const achievementUserId = accountUserId ?? (isDemoScope ? DEMO_USER_ID : null);
      const hasCachedAchievements =
        achievementUserId != null && Object.keys(readAchievementProgress(achievementUserId)).length > 0;
      if (!hasCachedAchievements) {
        setLoading(true);
      }
    }
  }, [scope, isLoading, data, accountUserId, isDemoScope]);

  const refreshData = useCallback(async () => {
    if (!scope) return;
    await queryClient.invalidateQueries({ queryKey });
    await refetch();
  }, [scope, queryClient, queryKey, refetch]);

  useEffect(() => {
    if (typeof window === 'undefined' || !scope) return;
    const onUpdate = () => {
      void refreshData();
    };
    window.addEventListener(STREAK_UPDATED_EVENT, onUpdate);
    return () => window.removeEventListener(STREAK_UPDATED_EVENT, onUpdate);
  }, [scope, refreshData]);

  const updateAchievementProgress = async (achievementId: string, amount = 1) => {
    const userId = accountUserId ?? (isDemoScope ? DEMO_USER_ID : undefined);
    if (!userId) return;
    await updateAchievementProgressForUser(userId, accountUserId, isDemoScope, achievementId, amount, () => {
      void refreshData();
    });
  };

  return {
    achievements,
    loading,
    totalXP,
    level,
    completedCount,
    updateAchievementProgress,
    coins,
    streak,
    currentStreak,
    longestStreak,
    refreshData,
    isDemoScope,
  };
};
