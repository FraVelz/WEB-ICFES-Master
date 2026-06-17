'use client';

import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { AsideCard } from './AsideCard';

type AsideAdSlotProps = {
  className?: string;
  slot?: string;
};

export function AsideAdSlot({ className, slot = 'aside-sidebar' }: AsideAdSlotProps) {
  return (
    <AsideCard title="Publicidad" icon="th-large" className={className}>
      <div
        data-ad-slot={slot}
        className={cn(
          'border-surface-border/80 bg-surface/30 flex min-h-[7.5rem] flex-col items-center justify-center',
          'rounded-xl border border-dashed px-4 py-6 text-center'
        )}
        aria-label="Espacio publicitario"
      >
        <Icon name="th-large" className="text-on-surface-muted/40 mb-2" size="lg" />
        <p className="text-on-surface-muted text-xs font-medium tracking-wide uppercase">Espacio publicitario</p>
        <p className="text-on-surface-muted/70 mt-1 max-w-48 text-xs leading-relaxed">Anuncio próximamente</p>
      </div>
    </AsideCard>
  );
}
