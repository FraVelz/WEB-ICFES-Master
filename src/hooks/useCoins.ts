'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  getCoinsBalance,
  addCoinsBalance,
  spendCoinsBalance,
  COINS_CHANGE_EVENT,
} from '@/services/persistence/coinsPersistence';

/**
 * Saldo de monedas unificado — escucha cambios entre pantallas (tienda, lecciones, sidebar).
 */
export function useCoins() {
  const { user } = useAuth();
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user?.uid) {
      setCoins(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const balance = await getCoinsBalance(user.uid);
      setCoins(balance);
    } catch (err) {
      console.error('Error cargando monedas:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onCoinsChanged = (event: Event) => {
      const detail = (event as CustomEvent<{ balance?: number }>).detail;
      if (detail?.balance != null) {
        setCoins(detail.balance);
        return;
      }
      refresh();
    };
    window.addEventListener(COINS_CHANGE_EVENT, onCoinsChanged);
    return () => window.removeEventListener(COINS_CHANGE_EVENT, onCoinsChanged);
  }, [refresh]);

  const addCoins = useCallback(
    async (amount: number, reason?: string) => {
      if (!user?.uid) return 0;
      return addCoinsBalance(user.uid, amount, reason);
    },
    [user?.uid]
  );

  const spendCoins = useCallback(
    async (amount: number, reason?: string) => {
      if (!user?.uid) return 0;
      return spendCoinsBalance(user.uid, amount, reason);
    },
    [user?.uid]
  );

  return { coins, loading, refresh, addCoins, spendCoins };
}
