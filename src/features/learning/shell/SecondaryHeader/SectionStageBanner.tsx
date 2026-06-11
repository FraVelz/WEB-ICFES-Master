'use client';

import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import type { PathSection } from '@/features/learning/roadmap/AreaPath';
import { getStageLabel } from './sectionStageUtils';

export interface SectionStageBannerProps {
  section: PathSection;
  areaColorClass: string;
  onOpenSections: () => void;
  onPrevSection?: () => void;
  onNextSection?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  className?: string;
}

export const SectionStageBanner = ({
  section,
  areaColorClass,
  onOpenSections,
  onPrevSection,
  onNextSection,
  hasPrev = false,
  hasNext = false,
  className,
}: SectionStageBannerProps) => {
  return (
    <div className={cn('bg-linear-to-r px-4 py-3 shadow-md', areaColorClass, className)}>
      <div className="mx-auto flex w-full max-w-xl items-center gap-2">
        {hasPrev && onPrevSection && (
          <button
            type="button"
            onClick={onPrevSection}
            aria-label="Etapa anterior"
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/90 transition-colors',
              'hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none'
            )}
          >
            <Icon name="chevron-left" />
          </button>
        )}

        <button
          type="button"
          onClick={onOpenSections}
          className={cn(
            'min-w-0 flex-1 cursor-pointer rounded-xl px-2 py-1 text-left transition-colors',
            'hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none'
          )}
          aria-haspopup="dialog"
        >
          <p className="text-xs font-bold tracking-wider text-white/80 uppercase">{getStageLabel(section.id)}</p>
          <p className="truncate text-base font-bold text-white sm:text-lg">{section.title}</p>
        </button>

        <div className="flex shrink-0 items-center gap-1">
          {hasNext && onNextSection && (
            <button
              type="button"
              onClick={onNextSection}
              aria-label="Siguiente etapa"
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg text-white/90 transition-colors',
                'hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none'
              )}
            >
              <Icon name="chevron-right" />
            </button>
          )}

          <button
            type="button"
            onClick={onOpenSections}
            aria-label="Ver todas las etapas"
            title="Ver etapas"
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 text-white transition-colors',
              'hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none'
            )}
          >
            <Icon name="book-open" />
          </button>
        </div>
      </div>
    </div>
  );
};
