import { useAuth } from '@/features/auth/context/AuthContext';
import { useUiSessionStore } from '@/store/uiSessionStore';
import { SHOP_ITEMS } from '../data/shopItems';
import { resolveShopUserId, useShopLoaders } from './useShopLoaders';
import { useShopActions } from './useShopActions';

/**
 * Hook de tienda — monedas e inventario unificados vía Supabase (demo: localStorage).
 */
export const useShop = () => {
  const { user } = useAuth();
  const demoMode = useUiSessionStore((state) => state.demoMode);
  const coinsUserId = resolveShopUserId(user?.uid, demoMode);

  const {
    coins,
    inventory,
    equippedLogoId,
    loading,
    error,
    streakShieldCount,
    setStreakShieldCount,
    applyInventoryState,
    refreshData,
  } = useShopLoaders(coinsUserId);

  const { processing, hasItem, buyItem, equipLogo, unequipLogo } = useShopActions({
    coinsUserId,
    coins,
    inventory,
    streakShieldCount,
    applyInventoryState,
    setStreakShieldCount,
  });

  const isEquipped = (itemId: string) => equippedLogoId === itemId;

  return {
    coins,
    inventory,
    equippedLogoId,
    hasItem,
    isEquipped,
    loading,
    error,
    processing,
    buyItem,
    equipLogo,
    unequipLogo,
    shopItems: SHOP_ITEMS,
    streakShieldCount,
    refreshData,
  };
};
