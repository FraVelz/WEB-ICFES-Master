/**
 * Hook de gamificación - Supabase o localStorage
 */
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ACHIEVEMENTS_DATA } from '@/shared/constants/achievementsData';
import { getVirtualMoney, gamificationPersistence } from '@/services/persistence';
import { isSupabaseMode } from '@/services/persistence/apiMode';
import GamificationSupabaseService from '@/services/supabase/GamificationSupabaseService';
import {
  backfillStreakFromAttempts,
  getStreakMetrics,
  loadStreakState,
  STREAK_UPDATED_EVENT,
  type StreakScope,
} from '@/services/streak';

const GAMIFICATION_KEY = 'icfes_gamification';
const STREAK_ACHIEVEMENT_ID = 'const_1';

interface AchievementMerged {
  progress: number;
  unlockedAt: string | null;
  status: string;
  id: string;
  category: string;
  title: string;
  description: string;
  icon: string;
  target: number;
  xpReward: number;
  coinsReward: number;
  [key: string]: unknown;
}

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

  const mergeAchievements = (
    achProgress: Record<string, { current?: number; unlocked?: boolean; unlockedAt?: string | null }>
  ) =>
    ACHIEVEMENTS_DATA.map((a) => {
      const p = achProgress[a.id] ?? {};
      const current = p.current ?? 0;
      const unlocked = p.unlocked ?? false;
      return {
        ...a,
        progress: current,
        unlockedAt: p.unlockedAt || null,
        status: unlocked ? 'completed' : current > 0 ? 'in_progress' : 'incomplete',
      };
    });

  const syncStreakAchievement = useCallback(
    async (userId: string, streakValue: number) => {
      if (streakValue <= lastSyncedStreak.current) return;
      const ach = ACHIEVEMENTS_DATA.find((a) => a.id === STREAK_ACHIEVEMENT_ID);
      if (!ach) return;

      const profile = await gamificationPersistence.getProfile(userId);
      const raw = profile?.achievements;
      const achProgress = (typeof raw === 'object' && raw !== null && !Array.isArray(raw) ? raw : {}) as Record<
        string,
        { current?: number; unlocked?: boolean; unlockedAt?: string | null }
      >;
      const current = achProgress[STREAK_ACHIEVEMENT_ID]?.current ?? 0;
      if (streakValue <= current) {
        lastSyncedStreak.current = streakValue;
        return;
      }

      const delta = streakValue - current;
      achProgress[STREAK_ACHIEVEMENT_ID] = {
        current: streakValue,
        unlocked: streakValue >= ach.target,
        unlockedAt: streakValue >= ach.target ? new Date().toISOString() : null,
      };

      if (isSupabaseMode()) {
        await GamificationSupabaseService.updateAchievements(userId, achProgress);
        if (streakValue >= ach.target) {
          await gamificationPersistence.addCoins(userId, ach.coinsReward || 0, 'achievement');
          await gamificationPersistence.addXP(userId, ach.xpReward || 0, 'achievement');
        }
      } else {
        let newTotalXP = profile?.totalXP || 0;
        if (streakValue >= ach.target) {
          newTotalXP += ach.xpReward || 0;
          const { addVirtualMoney } = await import('@/services/persistence');
          addVirtualMoney(ach.coinsReward || 0);
        }
        const newLevel = Math.min(5, Math.floor(newTotalXP / 2000) + 1);
        localStorage.setItem(
          GAMIFICATION_KEY,
          JSON.stringify({
            ...profile,
            achievements: achProgress,
            totalXP: newTotalXP,
            level: newLevel,
          })
        );
      }

      lastSyncedStreak.current = streakValue;
      void delta;
    },
    []
  );

  const loadData = useCallback(async () => {
    if (!scope) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      if (accountUserId) {
        const profile = await gamificationPersistence.getProfile(accountUserId);
        setTotalXP(profile?.totalXP ?? profile?.xp ?? 0);
        setLevel(profile?.level ?? 1);
        setCoins((profile?.totalCoins ?? 0) - (profile?.spentCoins ?? 0));

        const achProgress = (profile?.achievements ?? {}) as Record<
          string,
          { current?: number; unlocked?: boolean; unlockedAt?: string | null }
        >;
        const merged = mergeAchievements(achProgress);
        setAchievements(merged);
        setCompletedCount(merged.filter((m) => m.status === 'completed').length);

        if (!isSupabaseMode()) {
          setCoins(getVirtualMoney());
        }
      } else {
        setTotalXP(0);
        setLevel(1);
        setCoins(0);
        setAchievements(mergeAchievements({}));
        setCompletedCount(0);
      }

      await backfillStreakFromAttempts(scope);
      const streakState = await loadStreakState(scope);
      const metrics = getStreakMetrics(streakState);
      setStreak(metrics.dates);
      setCurrentStreak(metrics.currentStreak);
      setLongestStreak(metrics.longestStreak);

      if (accountUserId && metrics.currentStreak > 0) {
        await syncStreakAchievement(accountUserId, metrics.currentStreak);
      }
    } catch (err) {
      console.error('Error loading gamification:', err);
    } finally {
      setLoading(false);
    }
  }, [scope, accountUserId, syncStreakAchievement]);

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
    if (!accountUserId) return;
    const ach = ACHIEVEMENTS_DATA.find((a) => a.id === achievementId);
    if (!ach) return;

    const profile = await gamificationPersistence.getProfile(accountUserId);
    const raw = profile?.achievements;
    const achProgress = (typeof raw === 'object' && raw !== null && !Array.isArray(raw) ? raw : {}) as Record<
      string,
      { current?: number; unlocked?: boolean; unlockedAt?: string | null }
    >;
    const current = achProgress[achievementId] ?? {};
    if (current.unlocked) return;

    const newCurrent = (current.current || 0) + amount;
    const unlocked = newCurrent >= ach.target;
    achProgress[achievementId] = {
      current: newCurrent,
      unlocked,
      unlockedAt: unlocked ? new Date().toISOString() : null,
    };

    if (isSupabaseMode()) {
      if (unlocked) {
        await gamificationPersistence.addCoins(accountUserId, ach.coinsReward || 0, 'achievement');
      }
      await gamificationPersistence.addXP(accountUserId, unlocked ? ach.xpReward || 0 : 0, 'achievement');
      loadData();
      return;
    }

    let newTotalXP = profile?.totalXP || 0;
    if (unlocked) {
      newTotalXP += ach.xpReward || 0;
      const { addVirtualMoney } = await import('@/services/persistence');
      addVirtualMoney(ach.coinsReward || 0);
    }

    const newLevel = Math.min(5, Math.floor(newTotalXP / 2000) + 1);
    localStorage.setItem(
      GAMIFICATION_KEY,
      JSON.stringify({
        ...profile,
        achievements: achProgress,
        totalXP: newTotalXP,
        level: newLevel,
        longestStreak: (profile as { longestStreak?: number })?.longestStreak || 0,
      })
    );

    loadData();
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
