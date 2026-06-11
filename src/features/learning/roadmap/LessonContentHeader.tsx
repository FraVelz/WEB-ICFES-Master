import Link from 'next/link';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { BreadcrumbNav, type BreadcrumbItem } from '@/shared/components/BreadcrumbNav';

type LessonContentHeaderProps = {
  title?: string;
  backHref: string;
  progress: number;
  gradientClass: string;
  sectionInnerClass: string;
  breadcrumbItems?: BreadcrumbItem[];
};

export function LessonContentHeader({
  title,
  backHref,
  progress,
  gradientClass,
  sectionInnerClass,
  breadcrumbItems,
}: LessonContentHeaderProps) {
  return (
    <>
      <div className="shrink-0 border-b border-surface-border/80 bg-surface-elevated/90 backdrop-blur-md">
        {breadcrumbItems && breadcrumbItems.length > 0 && (
          <div className={cn(sectionInnerClass, 'border-b border-surface-border/50 py-2')}>
            <BreadcrumbNav items={breadcrumbItems} />
          </div>
        )}
        <div className={cn(sectionInnerClass, 'flex items-center justify-between py-2.5 sm:py-3')}>
          <Link
            href={backHref}
            className={cn(
              '-ml-1 flex min-w-[44px] cursor-pointer items-center gap-2 rounded-xl p-2 text-on-surface-muted',
              'transition-colors hover:bg-surface-overlay hover:text-white focus-visible:outline-none',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2',
              'focus-visible:ring-offset-surface-elevated'
            )}
          >
            <Icon name="arrow-left" className="text-lg" />
            <span className="hidden text-sm font-medium sm:inline">Salir</span>
          </Link>
          <h2 className="flex-1 truncate px-2 text-center text-sm font-bold text-white sm:px-4 sm:text-base">
            {title}
          </h2>
          <div className="w-14 sm:w-20" />
        </div>
      </div>

      <div className="h-1.5 shrink-0 bg-surface-overlay/80">
        <div
          className={cn('h-full bg-linear-to-r transition-all duration-300 ease-out', gradientClass)}
          style={{ width: `${progress}%` }}
        />
      </div>
    </>
  );
}
