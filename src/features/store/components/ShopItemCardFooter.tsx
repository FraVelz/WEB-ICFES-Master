import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { MAX_STREAK_SHIELDS } from '../constants/streakShield';
import type { ShopItem } from '../data/shopItems';
import { formatCountdown } from '../utils/formatCountdown';

type ShopItemCardFooterProps = {
  item: ShopItem;
  isPurchased: boolean;
  isPurchasedLogo: boolean;
  isEquipped: boolean;
  canAfford: boolean;
  processing: boolean;
  isDoubleXpActive: boolean;
  isStreakShield: boolean;
  streakShieldFull: boolean;
  doubleXpRemainingMs: number;
  streakShieldCount: number;
  onEquip?: (item: ShopItem) => void;
  onUnequip?: (item: ShopItem) => void;
};

export function ShopItemCardFooter({
  item,
  isPurchased,
  isPurchasedLogo,
  isEquipped,
  canAfford,
  processing,
  isDoubleXpActive,
  isStreakShield,
  streakShieldFull,
  doubleXpRemainingMs,
  streakShieldCount,
  onEquip,
  onUnequip,
}: ShopItemCardFooterProps) {
  if (isPurchasedLogo) {
    return (
      <button
        type="button"
        disabled={processing}
        onClick={(e) => {
          e.stopPropagation();
          void (isEquipped ? onUnequip?.(item) : onEquip?.(item));
        }}
        className={cn(
          'inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all',
          'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          'focus-visible:ring-offset-surface-via',
          processing && 'cursor-wait opacity-70',
          isEquipped
            ? 'bg-surface-overlay text-on-surface-muted hover:bg-on-surface-muted hover:text-on-surface'
            : 'bg-app-ring/20 text-app-accent hover:bg-app-ring/35 hover:shadow-app-ring/20 hover:shadow-md'
        )}
      >
        {processing ? (
          <>
            <Icon name="spinner" className="animate-spin" />
            Guardando...
          </>
        ) : isEquipped ? (
          <>
            <Icon name="times" />
            Quitar logo
          </>
        ) : (
          <>
            <Icon name="check" />
            Equipar logo
          </>
        )}
      </button>
    );
  }

  if (isDoubleXpActive) {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-2 rounded-lg border border-orange-600/35 bg-orange-100 px-4 py-2',
          'text-sm font-bold text-orange-900 tabular-nums dark:border-orange-500/30 dark:bg-orange-500/15',
          'dark:text-orange-300'
        )}
      >
        <Icon name="clock" />
        <span>{formatCountdown(doubleXpRemainingMs)}</span>
      </div>
    );
  }

  if (streakShieldFull) {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-2 rounded-lg border border-green-600/35 bg-green-100 px-4 py-2',
          'text-sm font-bold text-green-800 dark:border-green-500/30 dark:bg-green-500/15 dark:text-green-300'
        )}
      >
        <Icon name="shield-alt" />
        Inventario lleno
      </div>
    );
  }

  if (isStreakShield) {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all',
          canAfford
            ? cn(
                'border border-emerald-600/35 bg-emerald-100 text-emerald-900 group-hover:bg-emerald-500',
                'group-hover:text-on-surface dark:border-transparent dark:bg-emerald-500/10 dark:text-emerald-300 dark:group-hover:text-white'
              )
            : 'bg-surface-overlay text-on-surface-muted'
        )}
      >
        <Icon name="coins" />
        {item.price}
        {streakShieldCount > 0 && (
          <span className="text-xs opacity-80">
            ({streakShieldCount}/{MAX_STREAK_SHIELDS})
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all',
        isPurchased
          ? 'bg-surface-overlay text-on-surface-muted'
          : canAfford
            ? cn(
                'border border-amber-300/50 bg-amber-100 text-amber-800 group-hover:border-transparent',
                'group-hover:bg-yellow-500 group-hover:text-black dark:border-transparent',
                'dark:bg-yellow-500/10 dark:text-yellow-400'
              )
            : 'bg-surface-overlay text-on-surface-muted'
      )}
    >
      {isPurchased ? (
        <span>Adquirido</span>
      ) : (
        <>
          <Icon name="coins" />
          {item.price}
        </>
      )}
    </div>
  );
}
