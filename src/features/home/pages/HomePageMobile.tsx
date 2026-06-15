'use client';

import { cn } from '@/utils/cn';
import { MASCOT_IMAGES } from '@/assets';
import { MascotaCircle } from '@/shared/components/MascotaCircle';
import { ThemeToggle } from '@/shared/components/ThemeToggle';

import { Icon } from '@/shared/components/Icon';
import { useHomePrimaryCta } from '@/features/home/hooks/useHomePrimaryCta';

export const HomePageMobile = () => {
  const { isContinuing, isPrimaryBusy, primaryLabel, primaryIcon, handlePrimaryCta } = useHomePrimaryCta();

  return (
    <div
      className={cn(
        'from-surface via-surface-via to-surface text-on-surface flex h-dvh w-full max-w-full flex-col',
        'bg-linear-to-b'
      )}
    >
      {/* Background glow — mobile layout */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-60 dark:opacity-100">
        <div
          className={cn(
            'bg-ambient-a/15 dark:bg-ambient-a/30 absolute top-1/3 left-1/4',
            'h-48 w-48 animate-pulse rounded-full blur-2xl motion-reduce:animate-none'
          )}
        />
        <div
          className={cn(
            'bg-ambient-b/12 dark:bg-ambient-b/30 absolute right-1/4 bottom-1/3',
            'h-48 w-48 animate-pulse rounded-full blur-2xl motion-reduce:animate-none'
          )}
        />
        <div
          className={cn(
            'bg-ambient-c/8 dark:bg-ambient-c/20 absolute top-2/3 left-3/4',
            'h-32 w-32 animate-pulse rounded-full blur-2xl motion-reduce:animate-none'
          )}
        />
      </div>

      <div className="relative z-10 flex justify-end px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <ThemeToggle compact />
      </div>

      {/* Main Content - Centro */}
      <div className="relative z-10 flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4 px-6">
          {/* Logo */}
          <MascotaCircle src={MASCOT_IMAGES.logo} size="md" alt="Mascota de ICFES Master" />

          {/* Título principal (único h1 en vista móvil; desktop usa HeroSection) */}
          <h1 className="text-on-surface text-center text-2xl font-bold">Domina el ICFES desde Cero</h1>

          <p className="text-on-surface-muted text-lg font-semibold">ICFES Master</p>

          {/* Tagline */}
          <p className="text-on-surface-muted max-w-xs text-center text-sm">
            Prepárate para Saber 11° con simulacros, práctica por áreas y gamificación.
          </p>
        </div>
      </div>

      {/* Bottom CTAs — pinned */}
      <div
        className={cn(
          'relative z-10 flex w-full flex-col gap-3 px-6 pt-4',
          'pb-[max(1rem,env(safe-area-inset-bottom))]'
        )}
      >
        <button
          type="button"
          onClick={handlePrimaryCta}
          disabled={isPrimaryBusy}
          aria-busy={isPrimaryBusy}
          className={cn(
            'from-cta-from to-cta-to flex w-full transform items-center justify-center gap-2 rounded-lg',
            'bg-linear-to-r py-3 text-center font-semibold text-white transition-all duration-200',
            'hover:from-cta-from hover:to-cta-to hover:shadow-app-ring/40 hover:scale-105 hover:shadow-lg',
            'disabled:cursor-wait disabled:opacity-70 disabled:hover:scale-100'
          )}
        >
          <Icon name={isPrimaryBusy ? 'spinner' : primaryIcon} className={isPrimaryBusy ? 'animate-spin' : undefined} />
          {isPrimaryBusy ? (isContinuing ? 'Continuando...' : 'Cargando...') : primaryLabel}
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
