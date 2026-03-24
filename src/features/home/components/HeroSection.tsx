'use client';

import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';
import { AnimatedReveal } from '@/shared/components/AnimatedReveal';

export const HeroSection = ({
  onDemoAccess,
}: {
  onDemoAccess: () => void;
}) => {
  const handleDemoClick = () => {
    if (onDemoAccess) {
      onDemoAccess();
    } else {
      if (typeof window !== 'undefined') {
        localStorage.setItem('demoMode', 'true');
        window.location.href = '/ruta-aprendizaje';
      }
    }
  };

  return (
    <section className="flex min-h-dvh items-center justify-center px-6 pt-5 sm:pt-20 md:px-8">
      <div className="mx-auto max-w-6xl space-y-8 text-center">
        {/* Badge */}
        <AnimatedReveal
          isVisible
          delay={0}
          className="inline-flex items-center gap-2 rounded-full border border-cyan-500/50 bg-cyan-500/20 px-4 py-2"
        >
          <Icon name="star" className="text-cyan-400" />
          <span className="text-sm font-semibold text-cyan-400">
            Conviertete en en uno de los primeros estudiantes en alcanzar +400
          </span>
        </AnimatedReveal>

        {/* Main Title */}
        <AnimatedReveal isVisible delay={0.15}>
          <h1 className="mb-6 bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-5xl leading-tight font-black text-transparent md:text-7xl lg:text-8xl">
            Domina el ICFES desde Cero
          </h1>
        </AnimatedReveal>

        {/* Subtitle */}
        <AnimatedReveal isVisible delay={0.3}>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-300 md:text-xl">
            La plataforma #1 con{' '}
            <span className="font-bold text-cyan-400">+500 preguntas</span>,
            simulacros reales, gamificación adictiva y eficiente, y una
            comunidad de estudiantes preparándose contigo.
          </p>
        </AnimatedReveal>

        {/* CTA Buttons */}
        <AnimatedReveal
          isVisible
          delay={0.45}
          className="flex flex-col justify-center gap-4 pt-4 md:flex-row"
        >
          <button
            onClick={handleDemoClick}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50"
          >
            <Icon name="play" />
            Probar Demo
          </button>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 rounded-lg border-2 border-cyan-500 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500/10 hover:shadow-lg hover:shadow-cyan-500/30"
          >
            <Icon name="rocket" />
            Iniciar Sesión
          </Link>
        </AnimatedReveal>

        {/* Stats */}
        <AnimatedReveal
          isVisible
          delay={0.6}
          className="mx-auto grid max-w-2xl grid-cols-3 gap-4 pt-8"
        >
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-2 sm:p-4">
            <p className="text-3xl font-bold text-cyan-400">+500</p>
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
