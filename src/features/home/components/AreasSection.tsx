import { cn } from '@/utils/cn';
import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';
import { AREAS } from '@/features/home/data';

export const AreasSection = () => {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:px-8">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-4xl font-bold md:text-5xl">Domina Cada Área</h2>

        <p className="text-on-surface-muted mx-auto max-w-2xl text-lg">
          Contenido especializado, preguntas ICFES de simulacro y cursos para temas básicos, para las 5 áreas
          principales del ICFES
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {AREAS.map((area) => (
          <div key={area.id}>
            <Link
              href={`/practica/${area.id}`}
              className={cn(
                'group relative block rounded-xl',
                'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
                'focus-visible:ring-offset-surface focus-visible:ring-offset-2'
              )}
            >
              <div
                className={cn(
                  'h-full cursor-pointer rounded-xl border border-slate-700 p-8 transition-all duration-300',
                  'hover:scale-105 hover:border-slate-500 hover:shadow-lg hover:shadow-slate-900/50',
                  `bg-linear-to-br ${area.gradient}`
                )}
              >
                <div className="absolute top-6 right-6 text-5xl opacity-20">
                  <Icon name={area.icon} size="xl" className="text-white" />
                </div>

                <div className="relative z-10">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="text-4xl">
                      <Icon name={area.icon} size="xl" className="text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-white">{area.name}</h3>
                  </div>

                  <p className="mb-6 text-white/80">{area.description}</p>

                  <div className="mb-6 flex flex-wrap gap-3">
                    <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">
                      {area.preguntas} preguntas
                    </span>
                    <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">{area.dificultad}</span>
                  </div>

                  <div className="flex items-center gap-2 font-bold text-white transition-all duration-300 group-hover:gap-4">
                    Empezar
                    <Icon name="arrow-right" className="shrink-0 transition-transform group-hover:translate-x-2" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <div className="rounded-xl border-2 border-red-500/50 bg-linear-to-r from-red-600/20 to-pink-600/20 p-8 text-center">
          <h3 className="mb-4 flex items-center justify-center gap-2 text-3xl font-bold text-white">
            <Icon name="fire" className="shrink-0 text-red-400" />
            ¿Listo para el Desafío Real?
          </h3>

          <p className="text-on-surface-muted mx-auto mb-6 max-w-2xl">
            Realiza un simulacro completo bajo condiciones reales. 150 preguntas, tiempo limitado 4 horas y 30 minutos,
            puntuación exacta.
          </p>

          <Link
            href="/examen-completo"
            className={cn(
              'inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-red-600 to-pink-600 px-8',
              'py-4 font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg',
              'hover:shadow-red-500/50',
              'focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:outline-none',
              'focus-visible:ring-offset-surface focus-visible:ring-offset-2'
            )}
          >
            <Icon name="bullseye" />
            Hacer Simulacro Completo
          </Link>
        </div>
      </div>
    </section>
  );
};
