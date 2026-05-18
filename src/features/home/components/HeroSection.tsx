'use client';

import { cn } from '@/utils/cn';
import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';
import { AnimatedReveal } from '@/shared/components/AnimatedReveal';

import { useAppDispatch } from '@/store/hooks';
import { setDemoMode } from '@/store/slices/uiSessionSlice';

export const HeroSection = ({ onDemoAccess }: { onDemoAccess: () => void }) => {
  const dispatch = useAppDispatch();

  const handleDemoClick = () => {
    if (onDemoAccess) {
      onDemoAccess();
    } else {
      dispatch(setDemoMode(true));
      if (typeof window !== 'undefined') {
        window.location.href = '/ruta-aprendizaje';
      }
    }
  };

  return (
    <section className="focus:ring-app-accent flex min-h-dvh scroll-mt-4 items-center justify-center px-6 pt-5 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 sm:scroll-mt-6 sm:pt-20 md:px-8">
      <div className="mx-auto max-w-6xl space-y-8 text-center">
        {/* Badge */}
        <AnimatedReveal
          isVisible
          delay={0}
          className="border-app-ring/50 bg-app-ring/20 inline-flex items-center gap-2 rounded-full border px-4 py-2"
        >
          <Icon name="star" className="text-app-accent" />
          <span className="text-app-accent text-sm font-semibold">
            Conviertete en en uno de los primeros estudiantes en alcanzar +400
          </span>
        </AnimatedReveal>

        {/* Main Title */}
        <AnimatedReveal isVisible delay={0.15}>
          <h1
            className={cn(
              'from-cta-text-start via-cta-text-via to-cta-text-end mb-6 bg-linear-to-r bg-clip-text text-5xl',
              'leading-tight font-black text-transparent md:text-7xl lg:text-8xl'
            )}
          >
            Domina el ICFES desde Cero
          </h1>
        </AnimatedReveal>

        {/* Subtitle */}
        <AnimatedReveal isVisible delay={0.3}>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-300 md:text-xl">
            La plataforma #1 con <span className="text-app-accent font-bold">+500 preguntas</span>, simulacros reales,
            gamificación adictiva y eficiente, y una comunidad de estudiantes preparándose contigo.
          </p>
        </AnimatedReveal>

        {/* CTA Buttons */}
        <AnimatedReveal isVisible delay={0.45} className="flex flex-col justify-center gap-4 pt-4 md:flex-row">
          <button
            type="button"
            onClick={handleDemoClick}
            className={cn(
              'flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-linear-to-r',
              'from-cta-from to-cta-to px-8 py-4 text-lg font-bold text-white transition-all',
              'hover:shadow-app-ring/50 duration-300 hover:scale-105 hover:shadow-lg',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
              'focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'
            )}
          >
            <Icon name="play" />
            Probar Demo
          </button>
          <Link
            href="/login"
            className={cn(
              'border-app-ring flex items-center justify-center gap-2 rounded-lg border-2 px-8 py-4',
              'hover:border-app-accent text-lg font-bold text-white transition-all duration-300',
              'hover:bg-app-ring/10 hover:shadow-app-ring/30 hover:shadow-lg',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
              'focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'
            )}
          >
            <Icon name="rocket" />
            Iniciar Sesión
          </Link>
        </AnimatedReveal>

        {/* Stats */}
        <AnimatedReveal isVisible delay={0.6} className="mx-auto grid max-w-2xl grid-cols-3 gap-4 pt-8">
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-2 sm:p-4">
            <p className="text-app-accent text-3xl font-bold">+500</p>
            <p className="mt-1 text-xs text-slate-400">Preguntas</p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-2 sm:p-4">
            <p className="text-3xl font-bold text-purple-400">+1</p>
            <p className="mt-1 text-xs text-slate-400">Estudiantes</p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-2 sm:p-4">
            <p className="text-3xl font-bold text-pink-400">?400</p>
            <p className="mt-1 text-xs text-slate-400">Puntaje promedio</p>
          </div>
        </AnimatedReveal>
      </div>
    </section>
  );
};
