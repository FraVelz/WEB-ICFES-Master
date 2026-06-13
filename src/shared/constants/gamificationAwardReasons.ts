/** Patrones de `item` permitidos en `/api/gamification/award` (solo gasto de monedas). */

const SHOP_ITEM = /^shop_[a-z0-9_-]+$/;

const EXACT_SPEND_ITEMS = new Set(['purchase', 'user_wallet', 'use_user', 'shop_item']);

export function isAllowedSpendCoinsItem(item: string): boolean {
  const trimmed = item.trim();
  if (trimmed.length === 0 || trimmed.length > 64) return false;
  if (EXACT_SPEND_ITEMS.has(trimmed)) return true;
  return SHOP_ITEM.test(trimmed);
}
