'use client';

import Image from 'next/image';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { AvatarImage } from '@/features/user/components/AvatarImage';

export type LogoTileProps = {
  id: string;
  name: string;
  image: string | import('@/assets').ImageSource;
  color?: string;
  equipped: boolean;
  processing: boolean;
  onSelect: () => void;
  onDelete?: () => void;
};

export function LogoTile({ name, image, color, equipped, processing, onSelect, onDelete }: LogoTileProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        disabled={processing}
        onClick={onSelect}
        aria-pressed={equipped}
        aria-label={equipped ? `Quitar ${name}` : `Equipar ${name}`}
        className={cn(
          'group relative cursor-pointer rounded-2xl p-1 transition-all',
          'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2',
          'focus-visible:ring-offset-surface-via focus-visible:outline-none',
          equipped ? 'ring-app-accent ring-2 ring-offset-2 ring-offset-surface-via' : 'hover:scale-105'
        )}
      >
        <div
          className={cn(
            'relative h-16 w-16 rounded-full p-0.5 shadow-md',
            color ? `bg-linear-to-br ${color}` : 'from-app-ring/40 bg-linear-to-br to-surface-border'
          )}
        >
          <div className="relative h-full w-full overflow-hidden rounded-full bg-white">
            {typeof image === 'string' ? (
              <AvatarImage src={image} alt={name} sizes="64px" />
            ) : (
              <Image src={image} alt={name} fill sizes="64px" className="object-cover" />
            )}
          </div>
        </div>
        {equipped && (
          <span
            className={cn(
              'bg-app-accent absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center',
              'rounded-full text-surface-via'
            )}
          >
            <Icon name="check" size="sm" />
          </span>
        )}
      </button>
      <p className="line-clamp-1 max-w-[88px] text-center text-xs text-on-surface-muted">{name}</p>
      {onDelete ? (
        <button
          type="button"
          disabled={processing}
          onClick={onDelete}
          className="cursor-pointer text-[10px] text-red-400 underline-offset-2 hover:underline"
        >
          Eliminar
        </button>
      ) : (
        <span className="text-[10px] text-on-surface-muted">{equipped ? 'Equipado' : 'Toca para equipar'}</span>
      )}
    </div>
  );
}
