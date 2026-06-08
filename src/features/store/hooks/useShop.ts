import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useUiSessionStore } from '@/store/uiSessionStore';
import { resolveCoinsUserId } from '@/services/demo/demoCoins';
import { SHOP_ITEMS } from '../data/shopItems';
import { getCoinsBalance, spendCoinsBalance, COINS_CHANGE_EVENT } from '@/services/persistence';
import type { ShopItem } from '../data/shopItems';

const PURCHASES_KEY = 'icfes_shop_purchases';

function nextPurchaseId(item: ShopItem): string {
  return item.category === 'powerup' ? `${item.id}_${Date.now()}` : item.id;
}

/**
 * Hook de tienda — saldo unificado vía gamificationPersistence.
 */
export const useShop = () => {
  const { user } = useAuth();
  const demoMode = useUiSessionStore((state) => state.demoMode);
  const coinsUserId = resolveCoinsUserId(user?.uid, demoMode);
  const [coins, setCoins] = useState(0);
  const [purchases, setPurchases] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const loadCoins = useCallback(async () => {
    if (!coinsUserId) {
      setCoins(0);
      return;
    }
    const balance = await getCoinsBalance(coinsUserId);
    setCoins(balance);
  }, [coinsUserId]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await loadCoins();
      const stored = localStorage.getItem(PURCHASES_KEY);
      setPurchases(stored ? (JSON.parse(stored) as string[]) : []);
      setLoading(false);
    };
    load();
  }, [coinsUserId, loadCoins]);

  useEffect(() => {
    const onCoinsChanged = (event: Event) => {
      const detail = (event as CustomEvent<{ balance?: number }>).detail;
      if (detail?.balance != null) {
        setCoins(detail.balance);
        return;
      }
      loadCoins();
    };
    window.addEventListener(COINS_CHANGE_EVENT, onCoinsChanged);
    return () => window.removeEventListener(COINS_CHANGE_EVENT, onCoinsChanged);
  }, [loadCoins]);

  const refreshData = async () => {
    await loadCoins();
    const stored = localStorage.getItem(PURCHASES_KEY);
    setPurchases(stored ? (JSON.parse(stored) as string[]) : []);
  };

  const buyItem = async (item: ShopItem) => {
    if (!coinsUserId) throw new Error('Debes iniciar sesión o usar el modo demo');
    if (item.category !== 'powerup' && hasItem(item.id)) {
      throw new Error('Ya tienes este artículo');
    }
    if (coins < item.price) {
      throw new Error('Monedas insuficientes');
    }

    setProcessing(true);
    try {
      await spendCoinsBalance(coinsUserId, item.price, `shop_${item.id}`);
      const newPurchases = [...purchases, nextPurchaseId(item)];
      localStorage.setItem(PURCHASES_KEY, JSON.stringify(newPurchases));
      setPurchases(newPurchases);
      return true;
    } catch (error) {
      setProcessing(false);
      throw error;
    } finally {
      setProcessing(false);
    }
  };

  const hasItem = (itemId: string) =>
    purchases.some((p) => p === itemId || (typeof p === 'string' && p.startsWith(`${itemId}_`)));

  return {
    coins,
    purchases,
    hasItem,
    loading,
    processing,
    buyItem,
    shopItems: SHOP_ITEMS,
    refreshData,
  };
};
