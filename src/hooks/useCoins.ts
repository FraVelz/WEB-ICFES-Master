'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useUiSessionStore } from '@/store/uiSessionStore';
import { resolveCoinsUserId } from '@/services/demo/demoCoins';
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
  const demoMode = useUiSessionStore((state) => state.demoMode);
  const coinsUserId = resolveCoinsUserId(user?.uid, demoMode);
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!coinsUserId) {
      setCoins(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const balance = await getCoinsBalance(coinsUserId);
      setCoins(balance);
    } catch (err) {
      console.error('Error cargando monedas:', err);
    } finally {
      setLoading(false);
    }
  }, [coinsUserId]);

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
      if (!coinsUserId) return 0;
      return addCoinsBalance(coinsUserId, amount, reason);
    },
    [coinsUserId]
  );

  const spendCoins = useCallback(
    async (amount: number, reason?: string) => {
      if (!coinsUserId) return 0;
      return spendCoinsBalance(coinsUserId, amount, reason);
    },
    [coinsUserId]
  );

  return { coins, loading, refresh, addCoins, spendCoins };
}
