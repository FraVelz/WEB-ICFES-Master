import { useState, useEffect, useCallback } from 'react';
import {
  getUserProfile,
  getUserRank,
  type UserProfile,
  type UserRank,
} from '@/services/persistence';
import { getCoinsBalance, addCoinsBalance, spendCoinsBalance, COINS_CHANGE_EVENT } from '@/services/persistence';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useAppSelector } from '@/store/hooks';
import { resolveCoinsUserId } from '@/services/demo/demoCoins';

/**
 * Hook personalizado para manejar datos del usuario.
 * El saldo de monedas usa la capa unificada (gamificación / nube).
 */
export const useUser = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [rank, setRank] = useState<UserRank | null>(null);
  const [virtualMoney, setVirtualMoney] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user: authUser } = useAuth();
  const demoMode = useAppSelector((state) => state.uiSession.demoMode);
  const coinsUserId = resolveCoinsUserId(authUser?.uid, demoMode);

  const loadCoins = useCallback(async () => {
    if (!coinsUserId) {
      setVirtualMoney(0);
      return;
    }
    try {
      const balance = await getCoinsBalance(coinsUserId);
      setVirtualMoney(balance);
    } catch (err) {
      console.error('Error cargando monedas:', err);
    }
  }, [coinsUserId]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        let profile = getUserProfile();
        if (authUser?.displayName) {
          profile = {
            ...profile,
            username: authUser.displayName,
            displayName: authUser.displayName,
          } as UserProfile;
        }
        const userRank = getUserRank();
        setUser(profile);
        setRank(userRank);
        await loadCoins();
      } catch (err) {
        console.error('Error cargando datos del usuario:', err);
      }
      setIsLoading(false);
    };
    loadUserData();
  }, [authUser?.uid, authUser?.displayName, loadCoins, demoMode]);

  useEffect(() => {
    const onCoinsChanged = (event: Event) => {
      const detail = (event as CustomEvent<{ balance?: number }>).detail;
      if (detail?.balance != null) {
        setVirtualMoney(detail.balance);
        return;
      }
      loadCoins();
    };
    window.addEventListener(COINS_CHANGE_EVENT, onCoinsChanged);
    return () => window.removeEventListener(COINS_CHANGE_EVENT, onCoinsChanged);
  }, [loadCoins]);

  const refreshUser = async () => {
    const profile = getUserProfile();
    const userRank = getUserRank();
    setUser(profile);
    setRank(userRank);
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
      return true;
    } catch (_error) {
      console.error('Error al restar dinero:', _error);
      return false;
    }
  };

  return {
    user,
    rank,
    virtualMoney,
    isLoading,
    refreshUser,
    addMoney,
    removeMoney,
  };
};
