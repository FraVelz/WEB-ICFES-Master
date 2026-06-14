import Link from 'next/link';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';

type LessonContentHeaderProps = {
  title?: string;
  backHref: string;
  progress: number;
  gradientClass: string;
  sectionInnerClass: string;
};

export function LessonContentHeader({
  title,
  backHref,
  progress,
  gradientClass,
  sectionInnerClass,
}: LessonContentHeaderProps) {
  return (
    <>
      <div className="border-surface-border/80 bg-surface-elevated/90 shrink-0 border-b backdrop-blur-md">
        <div className={cn(sectionInnerClass, 'flex items-center justify-between py-2.5 sm:py-3')}>
          <Link
            href={backHref}
            className={cn(
              'text-on-surface-muted -ml-1 flex min-w-[44px] cursor-pointer items-center gap-2 rounded-xl p-2',
              'hover:bg-surface-overlay hover:text-on-surface transition-colors focus-visible:outline-none',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2',
              'focus-visible:ring-offset-surface-elevated'
            )}
          >
            <Icon name="arrow-left" className="text-lg" />
            <span className="hidden text-sm font-medium sm:inline">Salir</span>
          </Link>
          <h2 className="text-on-surface flex-1 truncate px-2 text-center text-sm font-bold sm:px-4 sm:text-base">
            {title}
          </h2>
          <div className="w-14 sm:w-20" />
        </div>
      </div>

      <div className="bg-surface-overlay/80 h-1.5 shrink-0">
        <div
          className={cn('h-full bg-linear-to-r transition-all duration-300 ease-out', gradientClass)}
          style={{ width: `${progress}%` }}
        />
      </div>
    </>
  );
}
