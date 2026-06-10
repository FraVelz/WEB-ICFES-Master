/**
 * Inventario de tienda — Supabase (`user_gamification`) o demo local.
 */
import GamificationSupabaseService, {
  type ShopInventoryState,
} from '@/services/supabase/GamificationSupabaseService';
import { isDemoUserId } from '@/services/demo/demoCoins';
import { isLogoShopItem } from '@/features/store/data/shopCatalog';

export type { ShopInventoryState };
export const SHOP_INVENTORY_CHANGE_EVENT = 'icfes:shop-inventory-changed';

const LEGACY_PURCHASES_KEY = 'icfes_shop_purchases';
const DEMO_SHOP_KEY = 'icfes_demo_shop_inventory';

function emitShopInventoryChange(state: ShopInventoryState): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent(SHOP_INVENTORY_CHANGE_EVENT, {
      detail: state,
    })
  );
}

function readDemoShopState(): ShopInventoryState {
  if (typeof window === 'undefined') {
    return { inventory: [], equippedLogoId: null };
  }
  const raw = localStorage.getItem(DEMO_SHOP_KEY);
  if (!raw) return { inventory: [], equippedLogoId: null };
  try {
    const parsed = JSON.parse(raw) as Partial<ShopInventoryState>;
    return {
      inventory: Array.isArray(parsed.inventory)
        ? parsed.inventory.filter((entry): entry is string => typeof entry === 'string')
        : [],
      equippedLogoId: typeof parsed.equippedLogoId === 'string' ? parsed.equippedLogoId : null,
    };
  } catch {
    return { inventory: [], equippedLogoId: null };
  }
}

function writeDemoShopState(state: ShopInventoryState): ShopInventoryState {
  if (typeof window !== 'undefined') {
    localStorage.setItem(DEMO_SHOP_KEY, JSON.stringify(state));
  }
  emitShopInventoryChange(state);
  return state;
}

function readLegacyPurchases(): string[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(LEGACY_PURCHASES_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry): entry is string => typeof entry === 'string');
  } catch {
    return [];
  }
}

function clearLegacyPurchases(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LEGACY_PURCHASES_KEY);
}

async function mergeLegacyPurchases(userId: string, state: ShopInventoryState): Promise<ShopInventoryState> {
  const legacy = readLegacyPurchases();
  if (legacy.length === 0) return state;
  const merged = [...new Set([...state.inventory, ...legacy])];
  if (merged.length === state.inventory.length) {
    clearLegacyPurchases();
    return state;
  }
  const next = await GamificationSupabaseService.saveShopInventory(userId, {
    inventory: merged,
    equippedLogoId: state.equippedLogoId,
  });
  clearLegacyPurchases();
  emitShopInventoryChange(next);
  return next;
}

export async function getShopInventoryState(userId: string): Promise<ShopInventoryState> {
  if (isDemoUserId(userId)) {
    const demo = readDemoShopState();
    const legacy = readLegacyPurchases();
    if (legacy.length === 0) return demo;
    const merged = [...new Set([...demo.inventory, ...legacy])];
    clearLegacyPurchases();
    return writeDemoShopState({ ...demo, inventory: merged });
  }

  const remote = await GamificationSupabaseService.getShopInventory(userId);
  return mergeLegacyPurchases(userId, remote);
}

export async function addShopInventoryItem(userId: string, itemId: string): Promise<ShopInventoryState> {
  if (isDemoUserId(userId)) {
    const current = readDemoShopState();
    if (current.inventory.includes(itemId)) return current;
    return writeDemoShopState({
      ...current,
      inventory: [...current.inventory, itemId],
    });
  }

  const next = await GamificationSupabaseService.addShopItem(userId, itemId);
  emitShopInventoryChange(next);
  return next;
}

export async function setEquippedShopLogo(userId: string, logoId: string | null): Promise<ShopInventoryState> {
  if (logoId && !isLogoShopItem(logoId)) {
    throw new Error('Solo puedes equipar logos de la tienda');
  }

  if (isDemoUserId(userId)) {
    const current = readDemoShopState();
    if (logoId && !current.inventory.includes(logoId)) {
      throw new Error('No tienes este logo en tu inventario');
    }
    return writeDemoShopState({
      ...current,
      equippedLogoId: logoId,
    });
  }

  const next = await GamificationSupabaseService.setEquippedLogo(userId, logoId);
  emitShopInventoryChange(next);
  return next;
}

export function hasShopInventoryItem(inventory: string[], itemId: string): boolean {
  return inventory.some((entry) => entry === itemId || entry.startsWith(`${itemId}_`));
}
