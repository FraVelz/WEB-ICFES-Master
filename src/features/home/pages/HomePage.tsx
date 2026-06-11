'use client';

import { cn } from '@/utils/cn';
import { enterDemoModeWithAssessment } from '@/features/home/utils/enterDemoMode';
import { ThemeToggle } from '@/shared/components/ThemeToggle';

import { HomePageDesktop } from './HomePageDesktop';
import { HomePageMobile } from './HomePageMobile';

/**
 * Móvil/desktop con CSS (breakpoints Tailwind), no JS con window:
 * mismo HTML en servidor y cliente → sin mismatch de hidratación.
 * Resize en PC actualiza la vista sin listeners.
 */
export const HomePage = () => {
  const handleDemoAccess = () => {
    enterDemoModeWithAssessment();
  };

  return (
    <>
      <a href="#main-content" className="skip-link">
        Saltar al contenido
      </a>
      <main id="main-content">
        <div className="pointer-events-none fixed top-4 right-4 z-50 hidden md:block">
          <div className="pointer-events-auto">
            <ThemeToggle compact />
          </div>
        </div>

        {/* Background glow effects - Fixed to viewport */}
        <div className="pointer-events-none fixed inset-0 z-0 opacity-60 motion-reduce:animate-none dark:opacity-100">
          <div
            className={cn(
              'bg-ambient-a-strong/20 dark:bg-ambient-a-strong/30 absolute top-1/3 left-1/4',
              'h-96 w-96 animate-pulse rounded-full blur-3xl motion-reduce:animate-none'
            )}
          />
          <div
            className={cn(
              'bg-ambient-b-strong/15 dark:bg-ambient-b-strong/30 absolute right-1/4 bottom-1/3',
              'h-96 w-96 animate-pulse rounded-full blur-3xl motion-reduce:animate-none'
            )}
          />
          <div
            className={cn(
              'bg-ambient-c-muted/10 dark:bg-ambient-c-muted/20 absolute top-2/3 left-3/4',
              'h-72 w-72 animate-pulse rounded-full blur-3xl motion-reduce:animate-none'
            )}
          />
        </div>

        <div className="md:hidden">
          <HomePageMobile />
        </div>
        <div className="hidden md:block">
          <HomePageDesktop onDemoAccess={handleDemoAccess} />
        </div>
      </main>
    </>
  );
};
