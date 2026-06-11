import { cn } from '@/utils/cn';
import Image from 'next/image';
import { Icon } from '@/shared/components/Icon';
import type { ShopItem } from '../data/shopItems';

const SIZE_CLASS = {
  card: 'h-20 w-20',
  modal: 'h-24 w-24',
} as const;

const IMAGE_SIZES = {
  card: '80px',
  modal: '96px',
} as const;

export interface ShopItemPreviewProps {
  item: ShopItem;
  variant?: keyof typeof SIZE_CLASS;
  className?: string;
}

export function ShopItemPreview({ item, variant = 'card', className }: ShopItemPreviewProps) {
  const isLogo = item.category === 'logo';

  return (
    <div
      className={cn(
        SIZE_CLASS[variant],
        'p-0.5 shadow-lg',
        isLogo ? 'rounded-full' : 'rounded-2xl',
        `bg-linear-to-br ${item.color}`,
        className
      )}
    >
      <div
        className={cn(
          'relative flex h-full w-full items-center justify-center overflow-hidden',
          isLogo ? 'rounded-full bg-white' : 'rounded-xl bg-surface-elevated'
        )}
      >
        {item.image ? (
          <Image src={item.image} alt={item.name} fill sizes={IMAGE_SIZES[variant]} className="object-cover" />
        ) : (
          <Icon name={item.icon} className="text-on-surface text-4xl" />
        )}
      </div>
    </div>
  );
}
