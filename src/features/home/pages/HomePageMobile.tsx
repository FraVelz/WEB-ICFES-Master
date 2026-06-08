'use client';

import { cn } from '@/utils/cn';
import { MASCOT_IMAGES } from '@/assets';
import { MascotaCircle } from '@/shared/components/MascotaCircle';
import { ThemeToggle } from '@/shared/components/ThemeToggle';

import { enterDemoModeWithAssessment } from '@/features/home/utils/enterDemoMode';

export const HomePageMobile = () => {
  return (
    <div className="from-surface via-surface-via to-surface text-on-surface flex h-dvh w-screen flex-col bg-linear-to-b">
      {/* Background glow — mobile layout */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-60 dark:opacity-100">
        <div className="bg-ambient-a/15 dark:bg-ambient-a/30 absolute top-1/3 left-1/4 h-48 w-48 animate-pulse rounded-full blur-2xl"></div>
        <div className="bg-ambient-b/12 dark:bg-ambient-b/30 absolute right-1/4 bottom-1/3 h-48 w-48 animate-pulse rounded-full blur-2xl"></div>
        <div className="bg-ambient-c/8 dark:bg-ambient-c/20 absolute top-2/3 left-3/4 h-32 w-32 animate-pulse rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 flex justify-end px-4 pt-4">
        <ThemeToggle compact />
      </div>

      {/* Main Content - Centro */}
      <div className="relative z-10 flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4 px-6">
          {/* Logo */}
          <MascotaCircle src={MASCOT_IMAGES.logo} size="md" />

          {/* App Name */}
          <h1 className="text-on-surface text-3xl font-bold">ICFES Master</h1>

          {/* Tagline */}
          <p className="text-on-surface-muted max-w-xs text-center text-sm">
            Domina el examen ICFES con nuestra plataforma, y diviértete mientras aprendes.
          </p>
        </div>
      </div>

      {/* Bottom CTAs — pinned */}
      <div className="relative z-10 flex w-full flex-col gap-3 px-6 py-6">
        <button
          onClick={() => {
            enterDemoModeWithAssessment();
          }}
          className={cn(
            'from-cta-from to-cta-to block w-full transform rounded-lg bg-linear-to-r py-3',
            'text-center font-semibold text-white transition-all duration-200 hover:scale-105',
            'hover:from-cta-from hover:to-cta-to hover:shadow-app-ring/40 hover:shadow-lg'
          )}
        >
          Probar Demo
        </button>

        <a
          href="/login"
          className={cn(
            'border-app-ring block w-full rounded-lg border-2 bg-transparent py-3 text-center',
            'text-app-accent hover:bg-app-ring/10 font-semibold transition-all duration-200'
          )}
        >
          Iniciar Sesión
        </a>
      </div>
    </div>
  );
};
