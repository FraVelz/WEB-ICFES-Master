import Link from 'next/link';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';

type LessonContentFooterProps = {
  prevHref: string | null;
  nextHref: string | null;
  stepLabel: string;
  gradientClass: string;
  sectionInnerClass: string;
};

export function LessonContentFooter({
  prevHref,
  nextHref,
  stepLabel,
  gradientClass,
  sectionInnerClass,
}: LessonContentFooterProps) {
  const navButtonBase = cn(
    'flex min-w-[44px] cursor-pointer items-center justify-center gap-1.5 rounded-xl',
    'font-medium transition-all sm:gap-2 sm:px-4 sm:py-3',
    'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2',
    'focus-visible:outline-none focus-visible:ring-offset-slate-950'
  );

  return (
    <div className="shrink-0 border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-md">
      <div className={cn(sectionInnerClass, 'flex items-center justify-between gap-2 py-3 sm:gap-4 sm:py-4')}>
        {prevHref ? (
          <Link
            href={prevHref}
            className={cn(
              navButtonBase,
              'border border-slate-700 bg-slate-800/80 px-3 py-2.5 text-slate-300',
              'hover:bg-slate-700/80 hover:text-white'
            )}
          >
            <Icon name="arrow-left" className="text-sm" />
            <span className="hidden text-sm sm:inline">Anterior</span>
          </Link>
        ) : (
          <span className="min-w-[44px]" />
        )}

        <span className="text-xs text-slate-500 sm:text-sm">{stepLabel}</span>

        {nextHref ? (
          <Link
            href={nextHref}
            className={cn(
              navButtonBase,
              'bg-linear-to-r px-3 py-2.5 text-white shadow-lg hover:opacity-95',
              'focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-slate-950',
              gradientClass
            )}
          >
            <span className="hidden text-sm sm:inline">Siguiente</span>
            <Icon name="arrow-right" className="text-sm" />
          </Link>
        ) : (
          <span className="min-w-[44px]" />
        )}
      </div>
    </div>
  );
}
