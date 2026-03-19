import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';

export const HeroCtaSection = ({ onDemoAccess, isMobile }) => {
  return (
    <section className="mx-auto max-w-7xl space-y-12 px-6 py-20 text-center md:px-8">
      {/* Main CTA */}
      <div className="space-y-6">
        <h2 className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-4xl font-black text-transparent md:text-5xl">
          ¿Listo para dominar el ICFES?
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-slate-300">
          Elige cómo quieres empezar. Todas las opciones son 100% gratuitas.
        </p>
      </div>

      {/* Three Path Selection */}
      <div
        className={`grid ${isMobile ? 'grid-cols-1' : 'md:grid-cols-3'} mx-auto max-w-4xl gap-6`}
      >
        {/* Path 1: Empezar Ahora */}
        <Link
          href="/dashboard"
          className="group rounded-2xl border-2 border-cyan-500/50 bg-linear-to-br from-cyan-500/20 to-blue-600/20 p-8 transition-all duration-300 hover:scale-105 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30"
        >
          <div className="mb-4 text-5xl text-cyan-400 transition-transform group-hover:scale-125">
            <Icon name="play-circle" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-white">Empezar Ahora</h3>
          <p className="mb-4 text-sm text-slate-300">
            Acceso inmediato a todas las preguntas y simulacros
          </p>
          <div className="text-sm font-bold text-cyan-400">
            Gratis para siempre →
          </div>
        </Link>

        {/* Path 2: Ver Demo */}
        <button
          onClick={onDemoAccess}
          className="group rounded-2xl border-2 border-purple-500/50 bg-linear-to-br from-purple-500/20 to-pink-600/20 p-8 text-left transition-all duration-300 hover:scale-105 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/30"
        >
          <div className="mb-4 text-5xl text-purple-400 transition-transform group-hover:scale-125">
            <Icon name="star" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-white">Ver Demo</h3>
          <p className="mb-4 text-sm text-slate-300">
            Prueba 3 minutos sin registrarte (ruta completa)
          </p>
          <div className="text-sm font-bold text-purple-400">
            Comenzar demo →
          </div>
        </button>

        {/* Path 3: Aprende Primero */}
        <Link
          href="/blog"
          className="group rounded-2xl border-2 border-orange-500/50 bg-linear-to-br from-orange-500/20 to-red-600/20 p-8 transition-all duration-300 hover:scale-105 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-500/30"
        >
          <div className="mb-4 text-5xl text-orange-400 transition-transform group-hover:scale-125">
            <Icon name="book" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-white">Aprende Primero</h3>
          <p className="mb-4 text-sm text-slate-300">
            Lee guías, tips y estrategias de estudio
          </p>
          <div className="text-sm font-bold text-orange-400">Ir a guías →</div>
        </Link>
      </div>

      {/* Quick Note */}
      <div className="mx-auto max-w-2xl rounded-lg border border-slate-700 bg-slate-800/50 p-4">
        <p className="text-sm text-slate-300">
          ✨ <span className="font-bold text-cyan-400">Dato:</span> Los
          estudiantes que usan simulacros regularmente tienen 3x más
          probabilidad de pasar el ICFES
        </p>
      </div>
    </section>
  );
};
