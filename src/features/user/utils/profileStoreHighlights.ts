import { SHOP_ITEMS } from '@/features/store/data/shopItems';
import { hasShopInventoryItem } from '@/services/persistence';

export type ProfileStoreHighlight = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  isEquipped?: boolean;
};

/** Ítems permanentes de la tienda (badges, logos) que el usuario posee. */
export function buildProfileStoreHighlights(
  inventory: string[],
  equippedLogoId: string | null
): ProfileStoreHighlight[] {
  const highlights: ProfileStoreHighlight[] = [];

  for (const item of SHOP_ITEMS) {
    if (item.category === 'powerup') continue;
    if (!hasShopInventoryItem(inventory, item.id)) continue;
    highlights.push({
      id: item.id,
      name: item.name,
      description: item.description,
      icon: item.icon,
      color: item.color,
      category: item.category,
      isEquipped: item.category === 'logo' && item.id === equippedLogoId,
    });
  }

  return highlights;
}
