import Link from 'next/link';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { formatTimeExtended } from '@/services/persistence';

type PracticeExamHeaderProps = {
  areaName: string;
  areaColor: string;
  subtitle: string;
  timeRemaining?: number | null;
  timeColor?: string;
  showTimer?: boolean;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onShowAnswerSheet?: () => void;
};

export function PracticeExamHeader({
  areaName,
  areaColor,
  subtitle,
  timeRemaining,
  timeColor,
  showTimer,
  mobileMenuOpen,
  onToggleMobileMenu,
  onShowAnswerSheet,
}: PracticeExamHeaderProps) {
  return (
    <div
      className={cn(
        'sticky top-0 z-40 border-b border-white/10 bg-linear-to-b from-gray-900 via-gray-900',
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
          <p className="text-sm text-gray-400">{subtitle}</p>
        </div>

        {showTimer && timeRemaining != null && (
          <div className={cn('font-mono text-2xl font-bold', timeColor)}>{formatTimeExtended(timeRemaining)}</div>
        )}

        <Link
          href="/"
          className={cn(
            'hidden rounded-lg bg-white/10 px-4 py-2 text-sm text-white transition-all duration-300',
            'hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent',
            'focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 md:block'
          )}
        >
          Salir
        </Link>

        <div className="relative md:hidden">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Menú de examen'}
            className={cn(
              'rounded-lg p-2 text-white transition-colors hover:bg-white/10',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent',
              'focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900'
            )}
          >
            <Icon name="ellipsis-vertical" size="xl" className="text-xl" />
          </button>

          {mobileMenuOpen && (
            <div className="fixed top-20 right-4 z-50 w-48 overflow-hidden rounded-lg border border-white/20 bg-gray-800 shadow-xl">
              {onShowAnswerSheet && (
                <button
                  type="button"
                  onClick={onShowAnswerSheet}
                  className={cn(
                    'flex w-full items-center gap-3 border-b border-white/10 px-4 py-3 text-white',
                    'transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2',
                    'focus-visible:ring-app-accent focus-visible:ring-inset'
                  )}
                >
                  <Icon name="clipboard" size="sm" className="text-sm" />
                  <span>Ver Respuestas</span>
                </button>
              )}
              <Link
                href="/"
                className={cn(
                  'flex items-center gap-3 px-4 py-3 text-white transition-colors hover:bg-white/10',
                  'rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent',
                  'focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900'
                )}
              >
                <Icon name="arrow-right-from-bracket" size="sm" className="text-sm" />
                <span>Salir</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
