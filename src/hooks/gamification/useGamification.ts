/**
 * Hook de gamificación — Supabase para cuentas; demo usa almacenamiento local de demo.
 */
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { gamificationPersistence, getCoinsBalance } from '@/services/persistence';
import { DEMO_USER_ID, getDemoCoins } from '@/services/demo/demoCoins';
import { getDemoTotalXP } from '@/services/demo/demoGamification';
import { calculateLevel } from '@/services/gamification/gamificationUtils';
import {
  normalizeAchievementsRecord,
  readAchievementProgress,
  syncAchievementsFromGameplay,
  type AchievementProgressMap,
} from '@/services/achievements/achievementProgressService';
import {
  backfillStreakFromAttempts,
  getStreakMetrics,
  loadStreakState,
  loadLocalStreakState,
  STREAK_UPDATED_EVENT,
  type StreakScope,
} from '@/services/streak';
import { countCompletedAchievements, mergeAchievements } from './gamificationAchievementMerge';
import { syncStreakAchievement } from './gamificationStreakSync';
import { updateAchievementProgressForUser } from './gamificationUpdateProgress';
import type { AchievementMerged } from './gamificationTypes';

/** `userId` real o `'demo'` para racha sin cuenta. */
export const useGamification = (scope: StreakScope | undefined) => {
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

  const applyMergedAchievements = useCallback((achProgress: AchievementProgressMap) => {
    const merged = mergeAchievements(achProgress);
    setAchievements(merged);
    setCompletedCount(countCompletedAchievements(merged));
  }, []);

  const loadData = useCallback(async () => {
    if (!scope) {
      setLoading(false);
      return;
    }

    const achievementUserId = accountUserId ?? (isDemoScope ? DEMO_USER_ID : null);
    const hasCachedAchievements =
      achievementUserId != null && Object.keys(readAchievementProgress(achievementUserId)).length > 0;

    if (!hasCachedAchievements) {
      setLoading(true);
    }

    try {
      let achProgress: AchievementProgressMap = {};
      let profile: Awaited<ReturnType<typeof gamificationPersistence.getProfile>> | null = null;

      if (accountUserId) {
        profile = await gamificationPersistence.getProfile(accountUserId);
        const xp = profile?.xp ?? 0;
        setTotalXP(xp);
        setLevel(calculateLevel(xp));
        setCoins((profile?.totalCoins ?? 0) - (profile?.spentCoins ?? 0));
      }

      await backfillStreakFromAttempts(scope);
      const streakState = await loadStreakState(scope);
      const metrics = getStreakMetrics(streakState);
      setStreak(metrics.dates);
      setCurrentStreak(metrics.currentStreak);
      setLongestStreak(metrics.longestStreak);

      if (achievementUserId) {
        achProgress = await syncAchievementsFromGameplay(achievementUserId, {
          remoteAchievements: profile ? normalizeAchievementsRecord(profile.achievements) : undefined,
          userLevel: profile ? calculateLevel(profile.xp ?? 0) : undefined,
          currentStreak: metrics.currentStreak,
        });
      }

      if (accountUserId) {
        applyMergedAchievements(achProgress);
      } else if (isDemoScope) {
        const balance = await getCoinsBalance(DEMO_USER_ID);
        const demoXP = getDemoTotalXP();
        setTotalXP(demoXP);
        setLevel(calculateLevel(demoXP));
        setCoins(balance);
        applyMergedAchievements(achProgress);
      }

      if (accountUserId && metrics.currentStreak > 0) {
        void syncStreakAchievement(accountUserId, metrics.currentStreak, lastSyncedStreak);
      }
    } catch (err) {
      console.error('Error loading gamification:', err);
    } finally {
      setLoading(false);
    }
  }, [scope, accountUserId, isDemoScope, applyMergedAchievements]);

  useEffect(() => {
    if (!scope) return;

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
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onUpdate = () => {
      void loadData();
    };
    window.addEventListener(STREAK_UPDATED_EVENT, onUpdate);
    return () => window.removeEventListener(STREAK_UPDATED_EVENT, onUpdate);
  }, [loadData]);

  const updateAchievementProgress = async (achievementId: string, amount = 1) => {
    const userId = accountUserId ?? (isDemoScope ? DEMO_USER_ID : undefined);
    if (!userId) return;
    await updateAchievementProgressForUser(userId, accountUserId, isDemoScope, achievementId, amount, () => {
      void loadData();
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
    refreshData: loadData,
    isDemoScope,
  };
};
