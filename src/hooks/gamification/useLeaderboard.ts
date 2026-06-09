'use client';

import { useState, useEffect } from 'react';
import { getProgress, getCoinsBalance, COINS_CHANGE_EVENT } from '@/services/persistence';
import { useAuth } from '@/features/auth/context/AuthContext';

/**
 * Hook de clasificación - Versión local con datos mock
 * Preparado para futura implementación de backend
 */
export interface LeaderboardPlayer {
  id: string;
  displayName?: string;
  name?: string;
  username?: string;
  profileImage?: string;
  weeklyXP?: number;
  rank?: string;
  virtualMoney?: number;
}

export const useLeaderboard = (currentRankId = 'novato') => {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buildLeaderboard = async () => {
      setLoading(true);
      const progress = getProgress();
      const coins = user?.uid ? await getCoinsBalance(user.uid) : 0;
      const mockUsers = [
        {
          id: 'local_user',
          displayName: 'Tú',
          weeklyXP: Math.floor((progress?.totalCorrect || 0) * 10),
          rank: 'novato',
          virtualMoney: coins,
        },
        {
          id: 'm1',
          displayName: 'Estudiante Ejemplo 1',
          weeklyXP: 450,
          rank: 'novato',
        },
        {
          id: 'm2',
          displayName: 'Estudiante Ejemplo 2',
          weeklyXP: 320,
          rank: 'novato',
        },
        {
          id: 'm3',
          displayName: 'Estudiante Ejemplo 3',
          weeklyXP: 280,
          rank: 'novato',
        },
        {
          id: 'm4',
          displayName: 'Estudiante Ejemplo 4',
          weeklyXP: 150,
          rank: 'novato',
        },
        {
          id: 'm5',
          displayName: 'Estudiante Ejemplo 5',
          weeklyXP: 90,
          rank: 'novato',
        },
      ].sort((a, b) => (b.weeklyXP || 0) - (a.weeklyXP || 0));
      setLeaderboardData(mockUsers);
      setLoading(false);
    };

    buildLeaderboard();
  }, [currentRankId, user?.uid]);

  useEffect(() => {
    if (!user?.uid) return;
    const onCoinsChanged = async () => {
      const coins = await getCoinsBalance(user.uid);
      setLeaderboardData((prev) =>
        prev.map((entry) => (entry.id === 'local_user' ? { ...entry, virtualMoney: coins } : entry))
      );
    };
    window.addEventListener(COINS_CHANGE_EVENT, onCoinsChanged);
    return () => window.removeEventListener(COINS_CHANGE_EVENT, onCoinsChanged);
  }, [user?.uid]);

  return { leaderboardData, loading, error: null as Error | null };
};
