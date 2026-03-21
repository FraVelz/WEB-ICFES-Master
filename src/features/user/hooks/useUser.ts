import { useState, useEffect } from 'react';
import {
  getUserProfile,
  getUserRank,
  getVirtualMoney,
  addVirtualMoney,
  removeVirtualMoney,
  type UserProfile,
  type UserRank,
} from '@/shared/utils/userProfile';
import { useAuth } from '@/context/AuthContext';

/**
 * Hook personalizado para manejar datos del usuario (localStorage)
 */
export const useUser = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [rank, setRank] = useState<UserRank | null>(null);
  const [virtualMoney, setVirtualMoney] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user: authUser } = useAuth();

  useEffect(() => {
    const loadUserData = () => {
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
        const money = getVirtualMoney();
        setUser(profile);
        setRank(userRank);
        setVirtualMoney(money);
      } catch (err) {
        console.error('Error cargando datos del usuario:', err);
      }
      setIsLoading(false);
    };
    loadUserData();
  }, [authUser?.uid, authUser?.displayName]);

  const refreshUser = () => {
    const profile = getUserProfile();
    const userRank = getUserRank();
    const money = getVirtualMoney();
    setUser(profile);
    setRank(userRank);
    setVirtualMoney(money);
  };

  const addMoney = (amount: number) => {
    try {
      addVirtualMoney(amount);
      setVirtualMoney(getVirtualMoney());
      return true;
    } catch (_error) {
      console.error('Error al añadir dinero:', _error);
      return false;
    }
  };

  const removeMoney = (amount: number) => {
    try {
      removeVirtualMoney(amount);
      setVirtualMoney(getVirtualMoney());
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
