'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { LeagueSupabaseService } from '@/services/league';
import { hasVipBadge } from '@/features/store/constants/vipBadge';
import {
  getShopInventoryState,
  SHOP_INVENTORY_CHANGE_EVENT,
  type ShopInventoryState,
} from '@/services/persistence';

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

export const useLeaderboard = (selectedLeagueRank: string, myLeagueRank: string | null) => {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const isMyLeague = myLeagueRank != null && selectedLeagueRank === myLeagueRank;

  const buildLeaderboard = useCallback(async () => {
    if (!user?.uid) {
      setLeaderboardData([]);
      setLoading(false);
      return;
    }

    if (!isMyLeague) {
      setLeaderboardData([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const rows = await LeagueSupabaseService.getMyLeaderboard();
      setLeaderboardData(rows);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error cargando clasificación'));
      setLeaderboardData([]);
    } finally {
      setLoading(false);
    }
  }, [user?.uid, isMyLeague]);

  useEffect(() => {
    void buildLeaderboard();
  }, [buildLeaderboard, selectedLeagueRank]);

  useEffect(() => {
    if (!user?.uid || !isMyLeague) return;

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
  }, [buildLeaderboard, isMyLeague, user?.uid]);

  useEffect(() => {
    if (!user?.uid || !isMyLeague) return;
    void getShopInventoryState(user.uid).then((state) => {
      const vip = hasVipBadge(state.inventory);
      setLeaderboardData((prev) =>
        prev.map((entry) => (entry.id === user.uid ? { ...entry, hasVipBadge: vip } : entry))
      );
    });
  }, [isMyLeague, user?.uid]);

  return {
    leaderboardData,
    loading,
    error,
    isMyLeague,
    refresh: buildLeaderboard,
  };
};
