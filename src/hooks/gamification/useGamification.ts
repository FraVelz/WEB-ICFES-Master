/**
 * Hook de gamificación - Supabase o localStorage
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { ACHIEVEMENTS_DATA } from '@/shared/constants/achievementsData';
import { getVirtualMoney, gamificationPersistence } from '@/services/persistence';
import { isSupabaseMode } from '@/services/persistence/apiMode';

const GAMIFICATION_KEY = 'icfes_gamification';
const STREAK_KEY = 'icfes_streak_dates';

const getLocalDateString = (date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

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

export const useGamification = (userId: string | undefined) => {
  const [achievements, setAchievements] = useState<AchievementMerged[]>([]);
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [completedCount, setCompletedCount] = useState(0);
  const [streak, setStreak] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  const calculateStreakFromDates = (dates: unknown[]) => {
    if (!dates?.length) return 0;
    const sorted = [...new Set(dates)].sort(
      (a: unknown, b: unknown) =>
        new Date(b as string | number | Date).getTime() - new Date(a as string | number | Date).getTime()
    );
    const today = getLocalDateString();
    const yesterday = getLocalDateString(new Date(Date.now() - 86400000));
    if (!sorted.includes(today) && !sorted.includes(yesterday)) return 0;
    let count = 0;
    let d = new Date((sorted.includes(today) ? today : yesterday) as string);
    while (sorted.includes(getLocalDateString(d))) {
      count++;
      d.setDate(d.getDate() - 1);
    }
    return count;
  };

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

  const loadData = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const profile = await gamificationPersistence.getProfile(userId);
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

      const streakDates = JSON.parse(localStorage.getItem(STREAK_KEY) || '[]');
      setStreak(streakDates);
      const cs = calculateStreakFromDates(streakDates);
      setCurrentStreak(cs);
      const gam = isSupabaseMode() ? {} : JSON.parse(localStorage.getItem(GAMIFICATION_KEY) || '{}');
      setLongestStreak(Math.max(gam.longestStreak || 0, cs));

      if (!isSupabaseMode()) {
        setCoins(getVirtualMoney());
      }
    } catch (err) {
      console.error('Error loading gamification:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateAchievementProgress = async (achievementId: string, amount = 1) => {
    if (!userId) return;
    const ach = ACHIEVEMENTS_DATA.find((a) => a.id === achievementId);
    if (!ach) return;

    const profile = await gamificationPersistence.getProfile(userId);
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
        await gamificationPersistence.addCoins(userId, ach.coinsReward || 0, 'achievement');
      }
      await gamificationPersistence.addXP(userId, unlocked ? ach.xpReward || 0 : 0, 'achievement');
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
  };
};
