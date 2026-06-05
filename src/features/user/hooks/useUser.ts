import { useState, useEffect, useCallback } from 'react';
import {
  getUserProfile,
  getUserRank,
  type UserProfile,
  type UserRank,
} from '@/services/persistence';
import { getCoinsBalance, addCoinsBalance, spendCoinsBalance, COINS_CHANGE_EVENT } from '@/services/persistence';
import { useAuth } from '@/features/auth/context/AuthContext';

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

  const loadCoins = useCallback(async () => {
    if (!authUser?.uid) {
      setVirtualMoney(0);
      return;
    }
    try {
      const balance = await getCoinsBalance(authUser.uid);
      setVirtualMoney(balance);
    } catch (err) {
      console.error('Error cargando monedas:', err);
    }
  }, [authUser?.uid]);

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
  }, [authUser?.uid, authUser?.displayName, loadCoins]);

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
    if (!authUser?.uid) return false;
    try {
      await addCoinsBalance(authUser.uid, amount, 'use_user');
      return true;
    } catch (_error) {
      console.error('Error al añadir dinero:', _error);
      return false;
    }
  };

  const removeMoney = async (amount: number) => {
    if (!authUser?.uid) return false;
    try {
      await spendCoinsBalance(authUser.uid, amount, 'use_user');
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
