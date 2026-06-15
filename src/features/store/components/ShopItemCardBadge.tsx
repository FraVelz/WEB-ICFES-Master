import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { DOUBLE_XP_ITEM_ID } from '../constants/doubleXp';
import { MAX_STREAK_SHIELDS, STREAK_SHIELD_ITEM_ID } from '../constants/streakShield';
import type { ShopItem } from '../data/shopItems';

type ShopItemCardBadgeProps = {
  item: ShopItem;
  isPurchased: boolean;
  isPurchasedLogo: boolean;
  isEquipped: boolean;
  canAfford: boolean;
  isDoubleXpActive: boolean;
  isStreakShield: boolean;
  streakShieldCount: number;
};

export function ShopItemCardBadge({
  item,
  isPurchased,
  isPurchasedLogo,
  isEquipped,
  canAfford,
  isDoubleXpActive,
  isStreakShield,
  streakShieldCount,
}: ShopItemCardBadgeProps) {
  if (isStreakShield && streakShieldCount > 0) {
    return (
      <span
        className={cn(
          'flex items-center gap-1 rounded-full border border-green-600/35 bg-green-100 px-2 py-1',
          'text-xs font-bold text-green-800 dark:border-green-500/30 dark:bg-green-500/20 dark:text-green-400'
        )}
      >
        <Icon name="shield-alt" />
        {streakShieldCount}/{MAX_STREAK_SHIELDS}
      </span>
    );
  }

  if (item.id === DOUBLE_XP_ITEM_ID && isDoubleXpActive) {
    return (
      <span
        className={cn(
          'flex items-center gap-1 rounded-full border border-orange-600/40 bg-orange-100 px-2 py-1',
          'text-xs font-bold text-orange-900 dark:border-orange-500/40 dark:bg-orange-500/20 dark:text-orange-300'
        )}
      >
        <Icon name="bolt" />
        ACTIVO
      </span>
    );
  }

  if (isPurchasedLogo && isEquipped) {
    return (
      <span
        className={cn(
          'bg-app-ring/20 border-app-ring/30 flex items-center gap-1 rounded-full border px-2 py-1',
          'text-app-accent text-xs font-bold'
        )}
      >
        <Icon name="check" />
        EQUIPADO
      </span>
    );
  }

  if (isPurchased && item.category !== 'logo') {
    return (
      <span
        className={cn(
          'flex items-center gap-1 rounded-full border border-green-600/35 bg-green-100 px-2 py-1',
          'dark:bg-lesson-sci-glow-a/20 text-xs font-bold text-green-800 dark:border-green-500/30 dark:text-green-400'
        )}
      >
        <Icon name="check" />
        ADQUIRIDO
      </span>
    );
  }

  if (!canAfford && !isPurchased) {
    return (
      <span
        className={cn(
          'flex max-w-full items-center gap-1 rounded-full border border-red-600/30 bg-red-100 px-2 py-1',
          'text-xs font-bold text-red-800 dark:border-red-500/30 dark:bg-red-500/20 dark:text-red-400'
        )}
      >
        <Icon name="lock" />
        FALTAN MONEDAS
      </span>
    );
  }

  return null;
}
