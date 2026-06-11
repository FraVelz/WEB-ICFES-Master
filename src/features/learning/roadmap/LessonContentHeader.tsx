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
      <div className="shrink-0 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md">
        <div className={cn(sectionInnerClass, 'flex items-center justify-between py-2.5 sm:py-3')}>
          <Link
            href={backHref}
            className={cn(
              '-ml-1 flex min-w-[44px] cursor-pointer items-center gap-2 rounded-xl p-2 text-slate-400',
              'transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline-none',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2',
              'focus-visible:ring-offset-slate-900'
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

      <div className="h-1.5 shrink-0 bg-slate-800/80">
        <div
          className={cn('h-full bg-linear-to-r transition-all duration-300 ease-out', gradientClass)}
          style={{ width: `${progress}%` }}
        />
      </div>
    </>
  );
}
