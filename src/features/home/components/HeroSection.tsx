'use client';

import { cn } from '@/utils/cn';
import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';
import { AnimatedReveal } from '@/features/home/components/AnimatedReveal';

import { useHomePrimaryCta } from '@/features/home/hooks/useHomePrimaryCta';

export const HeroSection = () => {
  const { isContinuing, isPrimaryBusy, primaryLabel, primaryIcon, handlePrimaryCta } = useHomePrimaryCta();

  return (
    <section
      className={cn(
        'flex min-h-dvh scroll-mt-4 items-center justify-center px-6',
        'pt-[max(1.25rem,env(safe-area-inset-top))] sm:scroll-mt-6 sm:pt-14 md:px-8'
      )}
    >
      <div className="mx-auto max-w-6xl space-y-8 text-center">
        {/* Badge */}
        <AnimatedReveal
          isVisible
          delay={0}
          className={cn(
            'border-app-ring/70 bg-surface-elevated dark:border-app-ring/50 dark:bg-app-ring/20',
            'inline-flex items-center gap-2 rounded-full border px-4 py-2 shadow-sm dark:shadow-none'
          )}
        >
          <Icon name="star" className="text-app-accent" />
          <span className="text-app-accent text-sm font-semibold">Saber 11° · práctica por áreas y simulacros</span>
        </AnimatedReveal>

        {/* Main Title */}
        <AnimatedReveal isVisible delay={0.15}>
          <h1
            className={cn(
              'hero-title-gradient from-cta-text-start via-cta-text-via to-cta-text-end mb-6 bg-linear-to-r',
              'bg-clip-text text-5xl leading-tight font-black text-transparent md:text-7xl lg:text-8xl'
            )}
          >
            Practica el ICFES con simulacros reales
          </h1>
        </AnimatedReveal>

        {/* Subtitle */}
        <AnimatedReveal isVisible delay={0.3}>
          <p className="text-on-surface-muted mx-auto max-w-3xl text-lg leading-relaxed font-medium md:text-xl">
            Preguntas por materia, temporizador y seguimiento de progreso para Saber 11° en Colombia. Gratis en web; hay
            app en App Store.
          </p>
        </AnimatedReveal>

        {/* CTA Buttons */}
        <AnimatedReveal isVisible delay={0.45} className="flex flex-col justify-center gap-4 pt-4 md:flex-row">
          <button
            type="button"
            onClick={handlePrimaryCta}
            disabled={isPrimaryBusy}
            aria-busy={isPrimaryBusy}
            className={cn(
              'flex items-center justify-center gap-2 rounded-lg bg-linear-to-r',
              'from-cta-from to-cta-to px-8 py-4 text-lg font-bold text-white transition-all',
              'hover:shadow-app-ring/50 duration-300 hover:scale-105 hover:shadow-lg',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
              'focus-visible:ring-offset-surface focus-visible:ring-offset-2',
              'disabled:cursor-wait disabled:opacity-70 disabled:hover:scale-100',
              'cursor-pointer'
            )}
          >
            <Icon
              name={isPrimaryBusy ? 'spinner' : primaryIcon}
              className={isPrimaryBusy ? 'animate-spin' : undefined}
            />
            {isPrimaryBusy ? (isContinuing ? 'Continuando...' : 'Cargando...') : primaryLabel}
          </button>
          <Link
            href="/login"
            className={cn(
              'border-app-ring bg-surface-elevated flex items-center justify-center gap-2',
              'rounded-lg border-2 px-8 py-4',
              'hover:border-app-accent text-app-accent text-lg font-bold transition-all duration-300',
              'hover:bg-surface-border/30 hover:shadow-app-ring/30 hover:shadow-lg',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
              'focus-visible:ring-offset-surface focus-visible:ring-offset-2'
            )}
          >
            <Icon name="rocket" />
            Iniciar Sesión
          </Link>
        </AnimatedReveal>

        <AnimatedReveal isVisible delay={0.6} className="pt-6">
          <p className="text-on-surface-muted text-sm font-medium">
            Más de 500 preguntas sacadas de recursos oficiales del ICFES
          </p>
        </AnimatedReveal>
      </div>
    </section>
  );
};
