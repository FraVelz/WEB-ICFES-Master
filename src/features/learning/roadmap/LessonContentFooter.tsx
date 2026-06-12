'use client';

import { useRef } from 'react';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { gsap } from '@/lib/gsap';
import { prefersReducedMotion } from '@/utils/prefersReducedMotion';

export type LessonNavDirection = 'prev' | 'next';

type LessonContentFooterProps = {
  prevHref: string | null;
  nextHref: string | null;
  stepLabel: string;
  gradientClass: string;
  sectionInnerClass: string;
  onNavigate: (href: string, direction: LessonNavDirection) => void;
  navigating?: boolean;
};

function playButtonTap(el: HTMLElement | null) {
  if (!el || prefersReducedMotion()) return;
  gsap.fromTo(el, { scale: 1 }, { scale: 0.92, duration: 0.09, yoyo: true, repeat: 1, ease: 'power2.out' });
}

export function LessonContentFooter({
  prevHref,
  nextHref,
  stepLabel,
  gradientClass,
  sectionInnerClass,
  onNavigate,
  navigating = false,
}: LessonContentFooterProps) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const navButtonBase = cn(
    'flex min-w-[44px] cursor-pointer items-center justify-center gap-1.5 rounded-xl',
    'font-medium transition-[color,background-color,border-color,box-shadow,transform] duration-200',
    'sm:gap-2 sm:px-4 sm:py-3',
    'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2',
    'focus-visible:outline-none focus-visible:ring-offset-surface-via',
    'disabled:cursor-not-allowed disabled:opacity-60'
  );

  const handlePrev = () => {
    if (!prevHref || navigating) return;
    playButtonTap(prevRef.current);
    onNavigate(prevHref, 'prev');
  };

  const handleNext = () => {
    if (!nextHref || navigating) return;
    playButtonTap(nextRef.current);
    onNavigate(nextHref, 'next');
  };

  return (
    <div className="border-surface-border/80 bg-surface-via/95 shrink-0 border-t backdrop-blur-md">
      <div className={cn(sectionInnerClass, 'flex items-center justify-between gap-2 py-3 sm:gap-4 sm:py-4')}>
        {prevHref ? (
          <button
            ref={prevRef}
            type="button"
            disabled={navigating}
            onClick={handlePrev}
            className={cn(
              navButtonBase,
              'border-surface-border bg-surface-elevated/90 text-on-surface-muted border px-3 py-2.5 shadow-sm',
              'hover:border-app-ring/45 hover:bg-surface-overlay hover:text-on-surface hover:shadow-md',
              'dark:bg-surface-overlay/55 dark:hover:border-app-ring/50 dark:hover:bg-surface-elevated dark:hover:text-on-surface',
              'active:scale-[0.97]'
            )}
          >
            <Icon name="arrow-left" className="text-sm" />
            <span className="hidden text-sm sm:inline">Anterior</span>
          </button>
        ) : (
          <span className="min-w-[44px]" />
        )}

        <span className="text-on-surface-muted text-xs sm:text-sm">{stepLabel}</span>

        {nextHref ? (
          <button
            ref={nextRef}
            type="button"
            disabled={navigating}
            onClick={handleNext}
            className={cn(
              navButtonBase,
              'bg-linear-to-r px-3 py-2.5 text-white shadow-lg hover:opacity-95 active:scale-[0.97]',
              'focus-visible:ring-offset-surface-via focus-visible:ring-2 focus-visible:ring-white',
              gradientClass
            )}
          >
            <span className="hidden text-sm sm:inline">Siguiente</span>
            <Icon name="arrow-right" className="text-sm" />
          </button>
        ) : (
          <span className="min-w-[44px]" />
        )}
      </div>
    </div>
  );
}
