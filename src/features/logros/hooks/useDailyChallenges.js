import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { generateDailyChallenges } from '../utils/challengeGenerator';
import { addVirtualMoney } from '@/shared/utils/userProfile';

const CHALLENGES_KEY = 'icfes_daily_challenges';

/**
 * Hook de desafíos diarios (localStorage)
 */
export const useDailyChallenges = (dateString) => {
  const { user } = useAuth();
  const targetDate = dateString || new Date().toISOString().split('T')[0];
  const today = new Date().toISOString().split('T')[0];

  const [challenges, setChallenges] = useState([]);
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

    const completed = dayChallenges.filter(c => c.status === 'completed').length;
    const totalXP = dayChallenges
      .filter(c => c.status === 'completed')
      .reduce((acc, c) => acc + (c.xpReward || 0), 0);

    setChallenges(dayChallenges);
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

  const completeChallenge = async (challengeId) => {
    if (!user?.uid || !challenges.length) return;
    const idx = challenges.findIndex(c => c.id === challengeId);
    if (idx === -1 || challenges[idx].status === 'completed') return;

    const updated = [...challenges];
    updated[idx] = {
      ...updated[idx],
      status: 'completed',
      progress: updated[idx].target,
      completedAt: new Date().toISOString()
    };

    addVirtualMoney(updated[idx].coinsReward || 0);

    const all = JSON.parse(localStorage.getItem(CHALLENGES_KEY) || '{}');
    all[targetDate] = { date: targetDate, challenges: updated };
    localStorage.setItem(CHALLENGES_KEY, JSON.stringify(all));

    const allCompleted = updated.every(c => c.status === 'completed');
    if (allCompleted) addVirtualMoney(50);

    loadChallenges();
  };

  const updateChallengeProgress = async (challengeId, newProgress) => {
    // No-op por ahora
  };

  return {
    challenges,
    loading,
    stats,
    completeChallenge,
    updateChallengeProgress,
    refreshChallenges: loadChallenges
  };
};
