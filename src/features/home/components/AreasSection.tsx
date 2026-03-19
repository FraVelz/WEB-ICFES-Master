import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';
import { AREAS } from "@/features/home/data";
import { AnimatedReveal } from "@/shared/components/AnimatedReveal";

export const AreasSection = ({ isInitialLoad, areasSection }:
  {
    isInitialLoad: boolean;
    areasSection: any 
  }) => {
  return (
    <section ref={areasSection.elementRef} className="max-w-7xl mx-auto px-6 md:px-8 py-20">
      <AnimatedReveal isVisible={areasSection.isVisible} isInitialLoad={isInitialLoad} delay={0.8} className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Domina Cada Área</h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">Contenido especializado, preguntas ICFES de simulacro y cursos para temas básicos, para las 5 áreas principales del ICFES</p>
      </AnimatedReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {AREAS.map((area, idx) => (
          <AnimatedReveal
            key={area.id}
            isVisible={areasSection.isVisible}
            isInitialLoad={isInitialLoad}
            delay={0.9 + idx * 0.15}
          >
          <Link
            href={`/practica/${area.id}`}
            className="group relative block"
          >
            <div className={`bg-linear-to-br ${area.gradient} rounded-xl p-8 border border-slate-700 hover:border-slate-500 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/50 hover:scale-105 cursor-pointer h-full`}>
              {/* Icon Background */}
              <div className="absolute top-6 right-6 text-5xl opacity-20">
                <Icon name={area.icon} size="xl" className="text-white" />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">
                    <Icon name={area.icon} size="xl" className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{area.name}</h3>
                </div>

                <p className="text-white/80 mb-6">{area.description}</p>

                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                    {area.preguntas} preguntas
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                    {area.dificultad}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-white font-bold group-hover:gap-4 transition-all duration-300">
                  Empezar
                  <Icon name="arrow-right" className="group-hover:translate-x-2 transition-transform shrink-0" />
                </div>
              </div>
            </div>
          </Link>
          </AnimatedReveal>
        ))}
      </div>

      {/* Call to action para simulacro */}
      <div className="mt-16 bg-linear-to-r from-red-600/20 to-pink-600/20 border-2 border-red-500/50 rounded-xl p-8 text-center">
        <h3 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-2">
          <Icon name="fire" className="text-red-400 shrink-0" />
          ¿Listo para el Desafío Real?
        </h3>
        <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
          Realiza un simulacro completo bajo condiciones reales. 150 preguntas, tiempo limitado 4 horas y 30 minutos, puntuación exacta.
        </p>
        <Link
          href="/examen-completo"
          className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-red-600 to-pink-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105"
        >
          <Icon name="bullseye" />
          Hacer Simulacro Completo
        </Link>
      </div>
    </section>
  );
};
