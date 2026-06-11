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
        'sticky top-0 z-40 border-b border-surface-border bg-surface-elevated/95 py-4 backdrop-blur-md'
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
          <p className="text-sm text-on-surface-muted">{subtitle}</p>
        </div>

        {showTimer && timeRemaining != null && (
          <div className={cn('font-mono text-2xl font-bold', timeColor)}>{formatTimeExtended(timeRemaining)}</div>
        )}

        <Link
          href="/"
          className={cn(
            'hidden rounded-lg border border-surface-border bg-surface-overlay px-4 py-2 text-sm',
            'text-on-surface transition-all duration-300 hover:bg-surface-border',
            'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
            'focus-visible:ring-offset-2 focus-visible:ring-offset-surface-via md:block'
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
              'rounded-lg p-2 text-on-surface transition-colors hover:bg-surface-overlay',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
              'focus-visible:ring-offset-2 focus-visible:ring-offset-surface-via'
            )}
          >
            <Icon name="ellipsis-vertical" size="xl" className="text-xl" />
          </button>

          {mobileMenuOpen && (
            <div
              className={cn(
                'fixed top-20 right-4 z-50 w-48 overflow-hidden rounded-lg border border-surface-border',
                'bg-surface-elevated shadow-xl'
              )}
            >
              {onShowAnswerSheet && (
                <button
                  type="button"
                  onClick={onShowAnswerSheet}
                  className={cn(
                    'flex w-full items-center gap-3 border-b border-surface-border px-4 py-3 text-on-surface',
                    'transition-colors hover:bg-surface-overlay focus-visible:ring-2 focus-visible:outline-none',
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
                  'flex items-center gap-3 px-4 py-3 text-on-surface transition-colors hover:bg-surface-overlay',
                  'focus-visible:ring-app-accent rounded-lg focus-visible:ring-2 focus-visible:outline-none',
                  'focus-visible:ring-offset-2 focus-visible:ring-offset-surface-via'
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
