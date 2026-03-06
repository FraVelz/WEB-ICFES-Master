import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faBook, faStar } from '@fortawesome/free-solid-svg-icons';

export const HeroCtaSection = ({ onDemoAccess, isMobile }) => {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-8 py-20 text-center space-y-12">
      {/* Main CTA */}
      <div className="space-y-6">
        <h2 className="text-4xl md:text-5xl font-black bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          ¿Listo para dominar el ICFES?
        </h2>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Elige cómo quieres empezar. Todas las opciones son 100% gratuitas.
        </p>
      </div>

      {/* Three Path Selection */}
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'md:grid-cols-3'} gap-6 max-w-4xl mx-auto`}>
        {/* Path 1: Empezar Ahora */}
        <Link
          href="/dashboard"
          className="group bg-linear-to-br from-cyan-500/20 to-blue-600/20 border-2 border-cyan-500/50 hover:border-cyan-400 rounded-2xl p-8 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-105"
        >
          <div className="text-5xl mb-4 text-cyan-400 group-hover:scale-125 transition-transform">
            <FontAwesomeIcon icon={faPlayCircle} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Empezar Ahora</h3>
          <p className="text-slate-300 text-sm mb-4">
            Acceso inmediato a todas las preguntas y simulacros
          </p>
          <div className="text-cyan-400 font-bold text-sm">
            Gratis para siempre →
          </div>
        </Link>

        {/* Path 2: Ver Demo */}
        <button
          onClick={onDemoAccess}
          className="group bg-linear-to-br from-purple-500/20 to-pink-600/20 border-2 border-purple-500/50 hover:border-purple-400 rounded-2xl p-8 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105 text-left"
        >
          <div className="text-5xl mb-4 text-purple-400 group-hover:scale-125 transition-transform">
            <FontAwesomeIcon icon={faStar} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Ver Demo</h3>
          <p className="text-slate-300 text-sm mb-4">
            Prueba 3 minutos sin registrarte (ruta completa)
          </p>
          <div className="text-purple-400 font-bold text-sm">
            Comenzar demo →
          </div>
        </button>

        {/* Path 3: Aprende Primero */}
        <Link
          href="/blog"
          className="group bg-linear-to-br from-orange-500/20 to-red-600/20 border-2 border-orange-500/50 hover:border-orange-400 rounded-2xl p-8 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105"
        >
          <div className="text-5xl mb-4 text-orange-400 group-hover:scale-125 transition-transform">
            <FontAwesomeIcon icon={faBook} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Aprende Primero</h3>
          <p className="text-slate-300 text-sm mb-4">
            Lee guías, tips y estrategias de estudio
          </p>
          <div className="text-orange-400 font-bold text-sm">
            Ir a guías →
          </div>
        </Link>
      </div>

      {/* Quick Note */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 max-w-2xl mx-auto">
        <p className="text-sm text-slate-300">
          ✨ <span className="font-bold text-cyan-400">Dato:</span> Los estudiantes que usan simulacros regularmente tienen 3x más probabilidad de pasar el ICFES
        </p>
      </div>
    </section>
  );
};
