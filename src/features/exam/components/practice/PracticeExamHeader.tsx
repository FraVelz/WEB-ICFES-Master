'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { formatTimeExtended } from '@/services/persistence';
import { useDialogA11y } from '@/shared/hooks/useDialogA11y';
import { SIMULACRO_PATH } from '@/features/exam/utils/simulacroNavigation';
import { ExamTimerLiveRegion } from '@/features/exam/components/practice/ExamTimerLiveRegion';

type PracticeExamHeaderProps = {
  areaName: string;
  areaColor: string;
  subtitle: string;
  exitHref?: string;
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
  exitHref = SIMULACRO_PATH,
  timeRemaining,
  timeColor,
  showTimer,
  mobileMenuOpen,
  onToggleMobileMenu,
  onCloseMobileMenu,
  onShowAnswerSheet,
}: PracticeExamHeaderProps) {
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useDialogA11y(mobileMenuOpen, onCloseMobileMenu, mobileMenuRef, { lockScroll: false });

  const handleShowAnswerSheet = () => {
    onCloseMobileMenu();
    onShowAnswerSheet?.();
  };

  const exitButtonClass =
    'relative z-[60] shrink-0 rounded-lg border px-3 py-2 text-sm sm:px-4 border-surface-border bg-surface-overlay text-on-surface hover:bg-surface-border transition-all duration-300 focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-offset-surface-via focus-visible:ring-offset-2';

  return (
    <div
      className={cn(
        'border-surface-border bg-surface-elevated/95 sticky top-0 z-50 shrink-0 border-b py-3 backdrop-blur-md sm:py-4'
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
          {showTimer && timeRemaining != null && (
            <>
              <div
                aria-hidden="true"
                className={cn('shrink-0 font-mono text-lg font-bold tabular-nums sm:text-2xl', timeColor)}
              >
                {formatTimeExtended(timeRemaining)}
              </div>
              <ExamTimerLiveRegion showTimer={showTimer} timeRemaining={timeRemaining} />
            </>
          )}

          <Link href={exitHref} className={cn(exitButtonClass, 'hidden md:inline-flex')}>
            Salir
          </Link>

          <div className="relative md:hidden">
            <button
              type="button"
              onClick={onToggleMobileMenu}
              aria-expanded={mobileMenuOpen}
              aria-haspopup="dialog"
              aria-controls="practice-exam-mobile-menu"
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
                  ref={mobileMenuRef}
                  id="practice-exam-mobile-menu"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Menú de examen"
                  className={cn(
                    'border-surface-border fixed top-20 right-4 z-[70] w-48 overflow-hidden rounded-lg border',
                    'bg-surface-elevated shadow-xl'
                  )}
                >
                  {onShowAnswerSheet && (
                    <button
                      type="button"
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
                    href={exitHref}
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
    </div>
  );
}
