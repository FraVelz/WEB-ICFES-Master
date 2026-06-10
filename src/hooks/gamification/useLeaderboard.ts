'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getProgress,
  getCoinsBalance,
  COINS_CHANGE_EVENT,
  getShopInventoryState,
  SHOP_INVENTORY_CHANGE_EVENT,
  type ShopInventoryState,
} from '@/services/persistence';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useUiSessionStore } from '@/store/uiSessionStore';
import { resolveCoinsUserId } from '@/services/demo/demoCoins';
import { hasVipBadge } from '@/features/store/constants/vipBadge';

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
  coinsBalance?: number;
  hasVipBadge?: boolean;
}

export const useLeaderboard = (currentRankId = 'novato') => {
  const { user } = useAuth();
  const demoMode = useUiSessionStore((state) => state.demoMode);
  const coinsUserId = resolveCoinsUserId(user?.uid, demoMode);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  const buildLeaderboard = useCallback(async () => {
    setLoading(true);
    const progress = getProgress();
    const coins = coinsUserId ? await getCoinsBalance(coinsUserId) : 0;
    let userHasVip = false;
    if (coinsUserId) {
      const shopState = await getShopInventoryState(coinsUserId);
      userHasVip = hasVipBadge(shopState.inventory);
    }
    const currentUserId = user?.uid ?? 'guest';
    const mockUsers: LeaderboardPlayer[] = [
      {
        id: currentUserId,
        displayName: 'Tú',
        name: user?.displayName ?? undefined,
        weeklyXP: Math.floor((progress?.totalCorrect || 0) * 10),
        rank: 'novato',
        coinsBalance: coins,
        hasVipBadge: userHasVip,
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
  }, [coinsUserId, user?.displayName, user?.uid]);

  useEffect(() => {
    void buildLeaderboard();
  }, [buildLeaderboard, currentRankId]);

  useEffect(() => {
    if (!coinsUserId || !user?.uid) return;
    const onCoinsChanged = async () => {
      const coins = await getCoinsBalance(coinsUserId);
      setLeaderboardData((prev) =>
        prev.map((entry) => (entry.id === user.uid ? { ...entry, coinsBalance: coins } : entry))
      );
    };
    window.addEventListener(COINS_CHANGE_EVENT, onCoinsChanged);
    return () => window.removeEventListener(COINS_CHANGE_EVENT, onCoinsChanged);
  }, [coinsUserId, user?.uid]);

  useEffect(() => {
    if (!coinsUserId || !user?.uid) return;
    const onInventoryChanged = (event: Event) => {
      const detail = (event as CustomEvent<ShopInventoryState>).detail;
      const vip = detail?.inventory ? hasVipBadge(detail.inventory) : null;
      if (vip == null) {
        void buildLeaderboard();
        return;
      }
      setLeaderboardData((prev) =>
        prev.map((entry) => (entry.id === user.uid ? { ...entry, hasVipBadge: vip } : entry))
      );
    };
    window.addEventListener(SHOP_INVENTORY_CHANGE_EVENT, onInventoryChanged);
    return () => window.removeEventListener(SHOP_INVENTORY_CHANGE_EVENT, onInventoryChanged);
  }, [buildLeaderboard, coinsUserId, user?.uid]);

  return { leaderboardData, loading, error: null as Error | null };
};
