import Link from 'next/link';
import { cn } from '@/utils/cn';
import { formatTimeExtended } from '@/services/persistence';

type FullExamHeaderProps = {
  areaName: string;
  areaColor: string;
  subtitle: string;
  timeRemaining?: number | null;
  timeColor?: string;
  showTimer?: boolean;
  onExit?: () => void;
};

export function FullExamHeader({
  areaName,
  areaColor,
  subtitle,
  timeRemaining,
  timeColor,
  showTimer,
  onExit,
}: FullExamHeaderProps) {
  const exitButtonClass = cn(
    'rounded-lg bg-white/10 px-4 py-2 text-sm text-white transition-all duration-300',
    'focus-visible:ring-app-accent hover:bg-white/20 focus-visible:ring-2 focus-visible:outline-none',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900'
  );

  return (
    <div
      className={cn(
        'border-surface-border from-surface-elevated via-surface-elevated sticky top-0 z-40 border-b bg-linear-to-b',
        'to-transparent py-4 backdrop-blur-md'
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <div>
          <div
            className={cn(
              'mb-2 inline-block rounded-lg px-3 py-1 text-xs font-semibold text-white',
              `bg-linear-to-r ${areaColor}`
            )}
          >
            {areaName}
          </div>
          <p className="text-on-surface-muted text-sm">{subtitle}</p>
        </div>

        {showTimer && timeRemaining != null && (
          <div
            aria-live="polite"
            aria-atomic="true"
            aria-label="Tiempo restante del examen"
            className={cn('font-mono text-2xl font-bold tabular-nums', timeColor)}
          >
            {formatTimeExtended(timeRemaining)}
          </div>
        )}

        {onExit ? (
          <button type="button" onClick={onExit} className={exitButtonClass}>
            Salir
          </button>
        ) : (
          <Link href="/" className={exitButtonClass}>
            Salir
          </Link>
        )}
      </div>
    </div>
  );
}
