import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { SHOP_ITEMS } from '../data/shopItems';
import { getCoinsBalance, spendCoinsBalance, COINS_CHANGE_EVENT } from '@/services/persistence';
import type { ShopItem } from '../data/shopItems';

const PURCHASES_KEY = 'icfes_shop_purchases';

/**
 * Hook de tienda — saldo unificado vía gamificationPersistence.
 */
export const useShop = () => {
  const { user } = useAuth();
  const [coins, setCoins] = useState(0);
  const [purchases, setPurchases] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const loadCoins = useCallback(async () => {
    if (!user?.uid) {
      setCoins(0);
      return;
    }
    const balance = await getCoinsBalance(user.uid);
    setCoins(balance);
  }, [user?.uid]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await loadCoins();
      const stored = localStorage.getItem(PURCHASES_KEY);
      setPurchases(stored ? (JSON.parse(stored) as string[]) : []);
      setLoading(false);
    };
    load();
  }, [user?.uid, loadCoins]);

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
    if (!user?.uid) throw new Error('Debes iniciar sesión');
    if (item.category !== 'powerup' && hasItem(item.id)) {
      throw new Error('Ya tienes este artículo');
    }
    if (coins < item.price) {
      throw new Error('Monedas insuficientes');
    }

    setProcessing(true);
    try {
      await spendCoinsBalance(user.uid, item.price, `shop_${item.id}`);
      const newPurchases =
        item.category === 'powerup' ? [...purchases, `${item.id}_${Date.now()}`] : [...purchases, item.id];
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
