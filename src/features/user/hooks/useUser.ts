import { useState, useEffect, useCallback } from 'react';
import type { UserProfile, UserRank } from '@/features/user/types/userProfile.types';
import { getPerformanceRank } from '@/features/user/utils/performanceRank';
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
import { useUiSessionStore } from '@/store/uiSessionStore';
import { resolveCoinsUserId } from '@/services/demo/demoCoins';
import type { MappedUser } from '@/services/supabase/UserSupabaseService';

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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [rank, setRank] = useState<UserRank | null>(null);
  const [coinsBalance, setCoinsBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user: authUser } = useAuth();
  const demoMode = useUiSessionStore((state) => state.demoMode);
  const coinsUserId = resolveCoinsUserId(authUser?.uid, demoMode);

  const loadCoins = useCallback(async () => {
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
  }, [coinsUserId]);

  const loadUserData = useCallback(async () => {
    try {
      setRank(getPerformanceRank());

      if (authUser?.uid) {
        const remote = await loadUserProfile(authUser.uid, authUser.email, authUser.displayName);
        if (remote && 'id' in remote) {
          setUser(toUserProfile(remote as MappedUser));
        }
      } else if (demoMode) {
        setUser(getDemoProfile());
      } else {
        setUser(null);
      }

      await loadCoins();
    } catch (err) {
      console.error('Error cargando datos del usuario:', err);
    } finally {
      setIsLoading(false);
    }
  }, [authUser?.uid, authUser?.email, authUser?.displayName, demoMode, loadCoins]);

  useEffect(() => {
    setIsLoading(true);
    void loadUserData();
  }, [loadUserData]);

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
        setUser((prev) =>
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
      void loadUserData();
    };
    window.addEventListener(USER_PROFILE_CHANGE_EVENT, onProfileChanged);
    return () => window.removeEventListener(USER_PROFILE_CHANGE_EVENT, onProfileChanged);
  }, [loadUserData]);

  const refreshUser = async () => {
    await loadUserData();
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
