'use client';

import { useEffect } from 'react';
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
  onCloseMobileMenu: () => void;
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
  onCloseMobileMenu,
  onShowAnswerSheet,
}: PracticeExamHeaderProps) {
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseMobileMenu();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen, onCloseMobileMenu]);

  const handleShowAnswerSheet = () => {
    onCloseMobileMenu();
    onShowAnswerSheet?.();
  };

  return (
    <div
      className={cn('border-surface-border bg-surface-elevated/95 sticky top-0 z-40 border-b py-4 backdrop-blur-md')}
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

        <Link
          href="/"
          className={cn(
            'border-surface-border bg-surface-overlay hidden rounded-lg border px-4 py-2 text-sm',
            'text-on-surface hover:bg-surface-border transition-all duration-300',
            'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
            'focus-visible:ring-offset-surface-via focus-visible:ring-offset-2 md:block'
          )}
        >
          Salir
        </Link>

        <div className="relative md:hidden">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            aria-expanded={mobileMenuOpen}
            aria-haspopup="menu"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Menú de examen'}
            className={cn(
              'text-on-surface hover:bg-surface-overlay rounded-lg p-2 transition-colors',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
              'focus-visible:ring-offset-surface-via focus-visible:ring-offset-2'
            )}
          >
            <Icon name="ellipsis-vertical" size="xl" className="text-xl" />
          </button>

          {mobileMenuOpen && (
            <>
              <button
                type="button"
                aria-label="Cerrar menú"
                className="fixed inset-0 z-40 bg-black/20"
                onClick={onCloseMobileMenu}
              />
              <div
                role="menu"
                className={cn(
                  'border-surface-border fixed top-20 right-4 z-50 w-48 overflow-hidden rounded-lg border',
                  'bg-surface-elevated shadow-xl'
                )}
              >
                {onShowAnswerSheet && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleShowAnswerSheet}
                    className={cn(
                      'border-surface-border text-on-surface flex w-full items-center gap-3 border-b px-4 py-3',
                      'hover:bg-surface-overlay transition-colors focus-visible:ring-2 focus-visible:outline-none',
                      'focus-visible:ring-app-accent focus-visible:ring-inset'
                    )}
                  >
                    <Icon name="clipboard" size="sm" className="text-sm" />
                    <span>Ver Respuestas</span>
                  </button>
                )}
                <Link
                  href="/"
                  role="menuitem"
                  onClick={onCloseMobileMenu}
                  className={cn(
                    'text-on-surface hover:bg-surface-overlay flex items-center gap-3 px-4 py-3 transition-colors',
                    'focus-visible:ring-app-accent rounded-lg focus-visible:ring-2 focus-visible:outline-none',
                    'focus-visible:ring-offset-surface-via focus-visible:ring-offset-2'
                  )}
                >
                  <Icon name="arrow-right-from-bracket" size="sm" className="text-sm" />
                  <span>Salir</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
