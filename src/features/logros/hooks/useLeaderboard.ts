import { useState, useEffect } from 'react';
import { getVirtualMoney } from '@/shared/utils/userProfile';
import { getProgress } from '@/shared/utils/progressStorage';

/**
 * Hook de clasificación - Versión local con datos mock
 * Preparado para futura implementación de backend
 */
export interface LeaderboardPlayer {
  id: string;
  displayName?: string;
  name?: string;
  username?: string;
  photoUrl?: string;
  profileImage?: string;
  weeklyXP?: number;
  rank?: string;
  virtualMoney?: number;
}

export const useLeaderboard = (currentRankId = 'novato') => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    const progress = getProgress();
    const coins = getVirtualMoney();
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
  }, [currentRankId]);

  return { leaderboardData, loading, error };
};
