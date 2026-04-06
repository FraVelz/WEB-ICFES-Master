'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { generateDailyChallenges } from '../utils/challengeGenerator';
import { addVirtualMoney } from '@/shared/utils/userProfile';

const CHALLENGES_KEY = 'icfes_daily_challenges';

export interface DailyChallenge {
  id: string;
  status?: string;
  target?: number;
  xpReward?: number;
  coinsReward?: number;
  [key: string]: unknown;
}

/** Daily challenges — localStorage */
export const useDailyChallenges = (dateString?: string) => {
  const { user } = useAuth();
  const targetDate = dateString || new Date().toISOString().split('T')[0];
  const today = new Date().toISOString().split('T')[0];

  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ completed: 0, total: 0, totalXP: 0 });

  const loadChallenges = useCallback(() => {
    const all = JSON.parse(localStorage.getItem(CHALLENGES_KEY) || '{}');
    let dayChallenges = all[targetDate]?.challenges || [];

    if (targetDate === today && dayChallenges.length === 0) {
      dayChallenges = generateDailyChallenges();
      all[targetDate] = { date: targetDate, challenges: dayChallenges };
      localStorage.setItem(CHALLENGES_KEY, JSON.stringify(all));
    }

    const typedChallenges = dayChallenges as DailyChallenge[];
    const completed = typedChallenges.filter((c: DailyChallenge) => c.status === 'completed').length;
    const totalXP = typedChallenges
      .filter((c: DailyChallenge) => c.status === 'completed')
      .reduce((acc: number, c: DailyChallenge) => acc + (c.xpReward ?? 0), 0);

    setChallenges(typedChallenges);
    setStats({ completed, total: dayChallenges.length, totalXP });
    setLoading(false);
  }, [targetDate, today]);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }
    setLoading(true);
    loadChallenges();
  }, [user?.uid, targetDate, loadChallenges]);

  const completeChallenge = async (challengeId: string) => {
    if (!user?.uid || !challenges.length) return;
    const idx = challenges.findIndex((c: DailyChallenge) => c.id === challengeId);
    if (idx === -1 || challenges[idx]?.status === 'completed') return;

    const updated = [...challenges];
    const currentCh = updated[idx];
    if (!currentCh || typeof currentCh !== 'object') return;
    updated[idx] = {
      ...currentCh,
      status: 'completed',
      progress: currentCh.target,
      completedAt: new Date().toISOString(),
    };

    addVirtualMoney((updated[idx]?.coinsReward as number) ?? 0);

    const all = JSON.parse(localStorage.getItem(CHALLENGES_KEY) || '{}');
    all[targetDate] = { date: targetDate, challenges: updated };
    localStorage.setItem(CHALLENGES_KEY, JSON.stringify(all));

    const allCompleted = updated.every((c: DailyChallenge) => c.status === 'completed');
    if (allCompleted) addVirtualMoney(50);

    loadChallenges();
  };

  const updateChallengeProgress = async (_challengeId: string, _newProgress: number) => {
    // Not implemented yet
  };

  return {
    challenges,
    loading,
    stats,
    completeChallenge,
    updateChallengeProgress,
    refreshChallenges: loadChallenges,
  };
};
