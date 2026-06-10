/**
 * Logos personales — Supabase (`user_gamification.personal_logos`) o demo local.
 */
import GamificationSupabaseService from '@/services/supabase/GamificationSupabaseService';
import { isDemoUserId } from '@/services/demo/demoCoins';
import { isLogoShopItem } from '@/features/store/data/shopCatalog';
import {
  getShopInventoryState,
  hasShopInventoryItem,
  setEquippedShopLogo,
  SHOP_INVENTORY_CHANGE_EVENT,
} from './shopInventoryPersistence';
import type { ShopInventoryState } from '@/services/supabase/GamificationSupabaseService';
import {
  createPersonalLogoId,
  isPersonalLogoId,
  type PersonalLogo,
} from '@/features/user/types/personalLogo.types';

export const PERSONAL_LOGOS_CHANGE_EVENT = 'icfes:personal-logos-changed';

const DEMO_PERSONAL_LOGOS_KEY = 'icfes_demo_personal_logos';

export type PersonalLogosChangeDetail = {
  logos: PersonalLogo[];
  equippedLogoId?: string | null;
};

function emitPersonalLogosChanged(detail: PersonalLogosChangeDetail): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(PERSONAL_LOGOS_CHANGE_EVENT, { detail }));
}

function readDemoPersonalLogos(): PersonalLogo[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(DEMO_PERSONAL_LOGOS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as PersonalLogo[];
  } catch {
    return [];
  }
}

function writeDemoPersonalLogos(logos: PersonalLogo[]): PersonalLogo[] {
  if (typeof window !== 'undefined') {
    localStorage.setItem(DEMO_PERSONAL_LOGOS_KEY, JSON.stringify(logos));
  }
  emitPersonalLogosChanged({ logos });
  return logos;
}

function emitShopInventoryChanged(state: ShopInventoryState): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(SHOP_INVENTORY_CHANGE_EVENT, { detail: state }));
}

export async function getPersonalLogos(userId: string): Promise<PersonalLogo[]> {
  if (isDemoUserId(userId)) {
    return readDemoPersonalLogos();
  }
  return GamificationSupabaseService.getPersonalLogos(userId);
}

export async function addPersonalLogo(
  userId: string,
  image: string,
  label: string
): Promise<PersonalLogo[]> {
  const logo: PersonalLogo = {
    id: createPersonalLogoId(),
    image,
    label,
    createdAt: new Date().toISOString(),
  };

  if (isDemoUserId(userId)) {
    const current = readDemoPersonalLogos();
    if (current.some((entry) => entry.image === image)) {
      throw new Error('Esa imagen ya está guardada como logo personal');
    }
    if (current.length >= 2) {
      throw new Error('Solo puedes guardar hasta 2 logos personales');
    }
    return writeDemoPersonalLogos([...current, logo]);
  }

  const logos = await GamificationSupabaseService.addPersonalLogo(userId, logo);
  emitPersonalLogosChanged({ logos });
  return logos;
}

export async function removePersonalLogo(
  userId: string,
  logoId: string
): Promise<PersonalLogosChangeDetail> {
  if (isDemoUserId(userId)) {
    const shopState = await getShopInventoryState(userId);
    const logos = readDemoPersonalLogos().filter((logo) => logo.id !== logoId);
    writeDemoPersonalLogos(logos);
    if (shopState.equippedLogoId === logoId) {
      await setEquippedShopLogo(userId, null);
      return { logos, equippedLogoId: null };
    }
    return { logos };
  }

  const result = await GamificationSupabaseService.removePersonalLogo(userId, logoId);
  emitPersonalLogosChanged({ logos: result.logos, equippedLogoId: result.equippedLogoId });
  const shopState = await getShopInventoryState(userId);
  emitShopInventoryChanged(shopState);
  return result;
}

export async function canEquipLogo(
  userId: string,
  logoId: string,
  shopInventory: string[]
): Promise<boolean> {
  if (isPersonalLogoId(logoId)) {
    const logos = await getPersonalLogos(userId);
    return logos.some((logo) => logo.id === logoId);
  }
  if (isLogoShopItem(logoId)) {
    return hasShopInventoryItem(shopInventory, logoId);
  }
  return false;
}
