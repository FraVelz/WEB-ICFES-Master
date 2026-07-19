'use client';

import Link from 'next/link';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { formatTimeExtended } from '@/services/persistence';

type FullExamHeaderProps = {
  areaName: string;
  areaColor: string;
  subtitle: string;
  exitHref?: string;
  timeRemaining?: number | null;
  timeColor?: string;
  showTimer?: boolean;
  onExit?: () => void;
  onOpenAnswerSheet?: () => void;
  answeredCount?: number;
};

export function FullExamHeader({
  areaName,
  areaColor,
  subtitle,
  exitHref = '/ruta-al-500',
  timeRemaining,
  timeColor,
  showTimer,
  onExit,
  onOpenAnswerSheet,
  answeredCount = 0,
}: FullExamHeaderProps) {
  const exitButtonClass =
    'relative z-[60] shrink-0 rounded-lg border px-3 py-2 text-sm sm:px-4 border-surface-border bg-surface-overlay text-on-surface hover:bg-surface-border transition-all duration-300 focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-offset-surface-via focus-visible:ring-offset-2';

  const exitControl = onExit ? (
    <button type="button" onClick={onExit} className={exitButtonClass}>
      Salir
    </button>
  ) : (
    <Link href={exitHref} className={exitButtonClass}>
      Salir
    </Link>
  );

  return (
    <div
      className={cn(
        'border-surface-border from-surface-elevated via-surface-elevated sticky top-0 z-50 shrink-0 border-b bg-linear-to-b',
        'to-transparent py-3 backdrop-blur-md sm:py-4'
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 sm:gap-4 sm:px-6">
        <div className="min-w-0 flex-1">
          <div
            className={cn(
              'mb-1 inline-block rounded-lg px-3 py-1 text-xs font-semibold text-white sm:mb-2',
              `bg-linear-to-r ${areaColor}`
            )}
          >
            {areaName}
          </div>
          <p className="text-on-surface-muted line-clamp-2 text-xs sm:text-sm">{subtitle}</p>
        </div>

        <div className="relative z-[60] flex shrink-0 items-center gap-1.5 sm:gap-3">
          {onOpenAnswerSheet && (
            <button
              type="button"
              onClick={onOpenAnswerSheet}
              aria-label="Abrir hoja de respuestas"
              className={cn(
                'relative inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 px-2.5 py-2 text-xs font-semibold text-white xl:hidden',
                'shadow-md shadow-cyan-500/30 transition-colors hover:bg-cyan-500 sm:px-3 sm:text-sm',
                'focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none'
              )}
            >
              <Icon name="clipboard-list" className="shrink-0" />
              <span className="hidden min-[380px]:inline">Respuestas</span>
              {answeredCount > 0 ? (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold">
                  {answeredCount}
                </span>
              ) : null}
            </button>
          )}
          {showTimer && timeRemaining != null && (
            <div
              aria-live="polite"
              aria-atomic="true"
              aria-label="Tiempo restante del examen"
              className={cn('shrink-0 font-mono text-lg font-bold tabular-nums sm:text-2xl', timeColor)}
            >
              {formatTimeExtended(timeRemaining)}
            </div>
          )}
          {exitControl}
        </div>
      </div>
    </div>
  );
}
