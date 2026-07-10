import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { UserProfile, UserRank } from '@/features/user/types/userProfile.types';
import { getPerformanceRank } from '@/features/user/utils/performanceRank';
import { PROGRESS_UPDATED_EVENT } from '@/storage/progressStorageTypes';
import { getDemoProfile } from '@/services/demo/demoProfile';
import {
  getCoinsBalance,
  addCoinsBalance,
  spendCoinsBalance,
  COINS_CHANGE_EVENT,
  USER_PROFILE_CHANGE_EVENT,
  loadUserProfile,
  type UserProfileChangeDetail,
} from '@/services/persistence';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useGamificationContextOptional } from '@/hooks/gamification/GamificationContext';
import { useUiSessionStore } from '@/store/uiSessionStore';
import { resolveCoinsUserId } from '@/services/demo/demoCoins';
import type { MappedUser } from '@/services/supabase/UserSupabaseService';
import { queryKeys } from '@/services/query/queryKeys';

function toUserProfile(data: MappedUser): UserProfile {
  return {
    id: data.id,
    username: data.username ?? data.displayName,
    displayName: data.displayName,
    email: data.email,
    bio: data.bio,
    profileImage: data.profileImage,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

/**
 * Header/sidebar user state — Supabase for accounts, demo profile for demo mode.
 */
export const useUser = () => {
  const [rank, setRank] = useState<UserRank | null>(null);
  const [coinsBalance, setCoinsBalance] = useState(0);
  const [demoUser, setDemoUser] = useState<UserProfile | null>(null);
  const { user: authUser } = useAuth();
  const demoMode = useUiSessionStore((state) => state.demoMode);
  const gamificationContext = useGamificationContextOptional();
  const queryClient = useQueryClient();
  const coinsUserId = resolveCoinsUserId(authUser?.uid, demoMode);

  const { data: profileData, isLoading: profileIsLoading } = useQuery({
    queryKey: queryKeys.userProfile(authUser?.uid ?? ''),
    queryFn: async () => {
      if (!authUser?.uid) return null;
      const remote = await loadUserProfile(authUser.uid, authUser.email, authUser.displayName);
      return remote && 'id' in remote ? toUserProfile(remote as MappedUser) : null;
    },
    enabled: !!authUser?.uid,
  });

  const user = useMemo(() => {
    if (authUser?.uid) return profileData ?? null;
    if (demoMode) return demoUser;
    return null;
  }, [authUser?.uid, demoMode, demoUser, profileData]);

  const isLoading = Boolean(authUser?.uid && profileIsLoading && profileData === undefined);

  const loadCoins = useCallback(async () => {
    if (gamificationContext != null) {
      setCoinsBalance(gamificationContext.coins);
      return;
    }

    if (!coinsUserId) {
      setCoinsBalance(0);
      return;
    }
    try {
      const balance = await getCoinsBalance(coinsUserId);
      setCoinsBalance(balance);
    } catch (err) {
      console.error('Error cargando monedas:', err);
    }
  }, [coinsUserId, gamificationContext]);

  useEffect(() => {
    setRank(getPerformanceRank());
    if (!authUser?.uid && demoMode) {
      setDemoUser(getDemoProfile());
    } else if (!authUser?.uid) {
      setDemoUser(null);
    }
  }, [authUser?.uid, demoMode]);

  useEffect(() => {
    void loadCoins();
  }, [loadCoins]);

  useEffect(() => {
    if (gamificationContext != null) {
      setCoinsBalance(gamificationContext.coins);
    }
  }, [gamificationContext?.coins]);

  useEffect(() => {
    const refreshRank = () => setRank(getPerformanceRank());
    window.addEventListener(PROGRESS_UPDATED_EVENT, refreshRank);
    return () => window.removeEventListener(PROGRESS_UPDATED_EVENT, refreshRank);
  }, []);

  useEffect(() => {
    const onCoinsChanged = (event: Event) => {
      const detail = (event as CustomEvent<{ balance?: number }>).detail;
      if (detail?.balance != null) {
        setCoinsBalance(detail.balance);
        return;
      }
      void loadCoins();
    };
    window.addEventListener(COINS_CHANGE_EVENT, onCoinsChanged);
    return () => window.removeEventListener(COINS_CHANGE_EVENT, onCoinsChanged);
  }, [loadCoins]);

  useEffect(() => {
    const onProfileChanged = (event: Event) => {
      const detail = (event as CustomEvent<UserProfileChangeDetail>).detail;
      if (detail && (detail.profileImage !== undefined || detail.username !== undefined || detail.bio !== undefined)) {
        if (!authUser?.uid) return;
        queryClient.setQueryData<UserProfile | null>(queryKeys.userProfile(authUser.uid), (prev) =>
          prev
            ? {
                ...prev,
                ...(detail.profileImage !== undefined ? { profileImage: detail.profileImage } : {}),
                ...(detail.username !== undefined ? { username: detail.username ?? prev.username } : {}),
                ...(detail.bio !== undefined ? { bio: detail.bio ?? prev.bio } : {}),
              }
            : prev
        );
        return;
      }
      if (authUser?.uid) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.userProfile(authUser.uid) });
      }
    };
    window.addEventListener(USER_PROFILE_CHANGE_EVENT, onProfileChanged);
    return () => window.removeEventListener(USER_PROFILE_CHANGE_EVENT, onProfileChanged);
  }, [authUser?.uid, queryClient]);

  const refreshUser = async () => {
    if (authUser?.uid) {
      await queryClient.invalidateQueries({ queryKey: queryKeys.userProfile(authUser.uid) });
    }
    await loadCoins();
  };

  const addMoney = async (amount: number) => {
    if (!coinsUserId) return false;
    try {
      await addCoinsBalance(coinsUserId, amount, 'use_user');
      return true;
    } catch (_error) {
      console.error('Error al añadir dinero:', _error);
      return false;
    }
  };

  const removeMoney = async (amount: number) => {
    if (!coinsUserId) return false;
    try {
      await spendCoinsBalance(coinsUserId, amount, 'use_user');
      if (authUser?.uid) {
        await queryClient.invalidateQueries({ queryKey: queryKeys.gamification(authUser.uid) });
      }
      return true;
    } catch (_error) {
      console.error('Error al restar dinero:', _error);
      return false;
    }
  };

  return {
    user,
    rank,
    coinsBalance,
    isLoading,
    refreshUser,
    addMoney,
    removeMoney,
  };
};
