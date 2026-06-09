'use client';

import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';
import { cn } from '@/utils/cn';
import type { LecturaSectionMeta } from '../constants';

type LecturaSectionCardProps = {
  section: LecturaSectionMeta;
  isRead: boolean;
};

const cardLinkClass = cn(
  'group border-surface-border bg-surface-elevated/60 flex items-start gap-4 rounded-2xl border p-5 transition-all',
  'hover:border-app-ring/40 hover:bg-surface-elevated hover:shadow-lg hover:shadow-app-ring/5',
  'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
  'focus-visible:ring-offset-surface'
);

export function LecturaSectionCard({ section, isRead }: LecturaSectionCardProps) {
  return (
    <Link href={section.path} className={cardLinkClass}>
      <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl', section.iconWrapClassName)}>
        <Icon name={section.icon} className={section.iconClassName} />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className={cn('text-on-surface text-lg font-bold transition-colors', section.hoverTitleClassName)}>
            {section.title}
          </h2>
          {isRead ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400">
              <Icon name="check-circle" className="text-sm" />
              Leído
            </span>
          ) : (
            <span className="border-on-surface-muted/40 text-on-surface-muted inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" aria-hidden />
              Pendiente
            </span>
          )}
        </div>
        <p className="text-on-surface-muted text-sm leading-relaxed">{section.description}</p>
      </div>
      <Icon
        name="chevron-right"
        className={cn('text-on-surface-muted mt-1 shrink-0 transition-colors', section.hoverChevronClassName)}
      />
    </Link>
  );
}
