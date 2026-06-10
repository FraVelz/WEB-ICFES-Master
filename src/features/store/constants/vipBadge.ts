import { hasShopInventoryItem } from '@/services/persistence';

export const VIP_BADGE_ITEM_ID = 'badge_vip';

export function hasVipBadge(inventory: string[]): boolean {
  return hasShopInventoryItem(inventory, VIP_BADGE_ITEM_ID);
}

/** Borde dorado del avatar en clasificatoria y perfil. */
export const VIP_AVATAR_BORDER_CLASS = 'border-yellow-400 shadow-lg shadow-yellow-500/30 ring-2 ring-yellow-500/40';
