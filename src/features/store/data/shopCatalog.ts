import type { ImageSource } from '@/assets';
import { SHOP_ITEMS } from './shopItems';
import type { ShopItem } from './shopItems';

export function getShopItemById(itemId: string): ShopItem | undefined {
  return SHOP_ITEMS.find((item) => item.id === itemId);
}

export function getLogoItemImage(logoId: string | null | undefined): ImageSource | null {
  if (!logoId) return null;
  const item = getShopItemById(logoId);
  if (item?.category !== 'logo' || !item.image) return null;
  return item.image;
}

export function isLogoShopItem(itemId: string): boolean {
  return getShopItemById(itemId)?.category === 'logo';
}

export function listOwnedLogoItems(inventory: string[]): ShopItem[] {
  const owned = new Set(inventory);
  return SHOP_ITEMS.filter((item) => item.category === 'logo' && owned.has(item.id));
}
