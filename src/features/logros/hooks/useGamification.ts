/**
 * Hook de gamificación - Supabase o localStorage
 */
import { useState, useEffect, useCallback } from 'react';
import { ACHIEVEMENTS_DATA } from '../constants/achievements';
import { getVirtualMoney } from '@/shared/utils/userProfile';
import { getProgress } from '@/shared/utils/progressStorage';
import API_CONFIG from '@/services/api.config';
import GamificationSupabaseService from '@/services/supabase/GamificationSupabaseService';

const GAMIFICATION_KEY = 'icfes_gamification';
const STREAK_KEY = 'icfes_streak_dates';

const getLocalDateString = (date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const getDefaultGamification = () => ({
  totalXP: 0,
  level: 1,
  achievements: {},
});

export const useGamification = (userId) => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [completedCount, setCompletedCount] = useState(0);
  const [streak, setStreak] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  const calculateStreakFromDates = (dates) => {
    if (!dates?.length) return 0;
    const sorted = [...new Set(dates)].sort(
      (a, b) => new Date(b) - new Date(a)
    );
    const today = getLocalDateString();
    const yesterday = getLocalDateString(new Date(Date.now() - 86400000));
    if (!sorted.includes(today) && !sorted.includes(yesterday)) return 0;
    let count = 0;
    let d = new Date(sorted.includes(today) ? today : yesterday);
    while (sorted.includes(getLocalDateString(d))) {
      count++;
      d.setDate(d.getDate() - 1);
    }
    return count;
  };

  const loadData = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      if (API_CONFIG.MODE === 'supabase') {
        const profile = await GamificationSupabaseService.getOrCreate(userId);
        setTotalXP(profile?.totalXP ?? profile?.xp ?? 0);
        setLevel(profile?.level ?? 1);
        setCoins((profile?.totalCoins ?? 0) - (profile?.spentCoins ?? 0));

        const achProgress = profile?.achievements || {};
        const merged = ACHIEVEMENTS_DATA.map((a) => {
          const p = achProgress[a.id] || {};
          const current = p.current ?? 0;
          const unlocked = p.unlocked ?? false;
          return {
            ...a,
            progress: current,
            unlockedAt: p.unlockedAt || null,
            status: unlocked
              ? 'completed'
              : current > 0
                ? 'in_progress'
                : 'incomplete',
          };
        });
        setAchievements(merged);
        setCompletedCount(
          merged.filter((m) => m.status === 'completed').length
        );
      } else {
        const gam = JSON.parse(localStorage.getItem(GAMIFICATION_KEY) || '{}');
        const g = { ...getDefaultGamification(), ...gam };
        const achProgress = g.achievements || {};
        const merged = ACHIEVEMENTS_DATA.map((a) => {
          const p = achProgress[a.id] || {};
          const current = p.current ?? 0;
          const unlocked = p.unlocked ?? false;
          return {
            ...a,
            progress: current,
            unlockedAt: p.unlockedAt || null,
            status: unlocked
              ? 'completed'
              : current > 0
                ? 'in_progress'
                : 'incomplete',
          };
        });
        setAchievements(merged);
        setTotalXP(g.totalXP ?? 0);
        setLevel(g.level ?? 1);
        setCompletedCount(
          merged.filter((m) => m.status === 'completed').length
        );
        setCoins(getVirtualMoney());
      }

      const streakDates = JSON.parse(localStorage.getItem(STREAK_KEY) || '[]');
      setStreak(streakDates);
      const cs = calculateStreakFromDates(streakDates);
      setCurrentStreak(cs);
      const gam =
        API_CONFIG.MODE === 'supabase'
          ? {}
          : JSON.parse(localStorage.getItem(GAMIFICATION_KEY) || '{}');
      setLongestStreak(Math.max(gam.longestStreak || 0, cs));
    } catch (err) {
      console.error('Error loading gamification:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateAchievementProgress = async (achievementId, amount = 1) => {
    if (!userId) return;
    const ach = ACHIEVEMENTS_DATA.find((a) => a.id === achievementId);
    if (!ach) return;

    if (API_CONFIG.MODE === 'supabase') {
      const profile = await GamificationSupabaseService.getOrCreate(userId);
      const achProgress = profile?.achievements || {};
      const current = achProgress[achievementId] || {};
      if (current.unlocked) return;

      const newCurrent = (current.current || 0) + amount;
      const unlocked = newCurrent >= ach.target;
      achProgress[achievementId] = {
        current: newCurrent,
        unlocked,
        unlockedAt: unlocked ? new Date().toISOString() : null,
      };

      let newTotalXP =
        (profile?.totalXP ?? 0) + (unlocked ? ach.xpReward || 0 : 0);
      if (unlocked) {
        await GamificationSupabaseService.addCoins(
          userId,
          ach.coinsReward || 0,
          'achievement'
        );
      }
      await GamificationSupabaseService.addXP(
        userId,
        unlocked ? ach.xpReward || 0 : 0,
        'achievement'
      );
      loadData();
      return;
    }

    const gam = JSON.parse(localStorage.getItem(GAMIFICATION_KEY) || '{}');
    const achProgress = gam.achievements || {};
    const current = achProgress[achievementId] || {};
    if (current.unlocked) return;

    const newCurrent = (current.current || 0) + amount;
    const unlocked = newCurrent >= ach.target;
    achProgress[achievementId] = {
      current: newCurrent,
      unlocked,
      unlockedAt: unlocked ? new Date().toISOString() : null,
    };

    let newTotalXP = gam.totalXP || 0;
    if (unlocked) {
      newTotalXP += ach.xpReward || 0;
      const { addVirtualMoney } = await import('@/shared/utils/userProfile');
      addVirtualMoney(ach.coinsReward || 0);
    }

    const newLevel = Math.min(5, Math.floor(newTotalXP / 2000) + 1);
    localStorage.setItem(
      GAMIFICATION_KEY,
      JSON.stringify({
        ...gam,
        achievements: achProgress,
        totalXP: newTotalXP,
        level: newLevel,
        longestStreak: gam.longestStreak || 0,
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
