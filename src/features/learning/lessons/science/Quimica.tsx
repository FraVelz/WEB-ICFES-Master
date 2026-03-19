import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';

export const Quimica = () => {
  const content = {
    title: 'Química Orgánica e Inorgánica Avanzada',
    duration: '10-11 horas',
    lessons: 28,
    difficulty: 'muy difícil',
    topics: [
      {
        name: 'Moléculas',
        description: 'Estructura de moléculas orgánicas con átomos de carbono.',
        subtopics: [
          'Enlaces covalentes',
          'Cadenas de carbono',
          'Grupos funcionales',
          'Isómeros',
        ],
        examples: [
          'Alcanos: C-C enlaces simples',
          'Alquenos: C=C doble enlace',
          'Benceno: anillo aromático',
        ],
      },
      {
        name: 'Reacciones Orgánicas',
        description: 'Tipos de reacciones químicas en moléculas orgánicas.',
        subtopics: [
          'Sustitución y eliminación',
          'Adición',
          'Oxidación-reducción',
          'Reacciones de condensación',
        ],
        examples: [
          'Sustitución: R-X + Y⁻ → R-Y + X⁻',
          'Adición a doble enlace',
          'Combustión: CₙHₘ + O₂ → CO₂ + H₂O',
        ],
      },
      {
        name: 'Ácidos y Bases',
        description: 'Teoría de ácidos-bases de Brønsted-Lowry y pH.',
        subtopics: [
          'Definición ácido-base',
          'pH y pOH',
          'Reacciones de neutralización',
          'Buffer y soluciones amortiguadoras',
        ],
        examples: [
          'HCl es ácido fuerte',
          'NaOH es base fuerte',
          'pH = 7: neutro, <7: ácido, >7: básico',
        ],
      },
    ],
    keyFormulas: [
      'pH = -log[H⁺]',
      'pOH = -log[OH⁻]',
      'pH + pOH = 14',
      '[H⁺][OH⁻] = 10⁻¹⁴',
      'Neutralización: ácido + base → sal + agua',
    ],
    practiceExercises: [
      'Calcular pH de solución con [H⁺] = 10⁻³',
      'Equilibrar ecuación: C₆H₁₂ + O₂ → CO₂ + H₂O',
      'Identificar grupo funcional en moléculas',
      'Escribir reacción de neutralización',
    ],
  };

  return (
    <div className="min-h-dvh bg-linear-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-96 w-96 animate-pulse rounded-full bg-green-500/20 blur-3xl"></div>
        <div className="absolute right-1/4 bottom-0 h-96 w-96 animate-pulse rounded-full bg-emerald-500/20 blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-10">
        <div className="mb-12 flex items-center justify-between">
          <Link
            href="/aprendizaje"
            className="flex items-center gap-3 text-gray-400 transition-colors hover:text-blue-400"
          >
            <Icon name="arrow-left" className="text-xl" />
            Volver
          </Link>
          <p className="text-sm text-gray-400">Ciencias Naturales</p>
        </div>

        <header className="mb-16 text-center">
          <div className="mb-6 flex items-center justify-center gap-4">
            <Icon name="flask" className="text-5xl text-green-400" />
            <h1 className="bg-linear-to-r from-green-400 to-emerald-400 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
              {content.title}
            </h1>
          </div>
          <div className="mb-8 flex justify-center gap-8 text-gray-300">
            <span className="flex items-center gap-2">
              <Icon name="clock" /> {content.duration}
            </span>
            <span className="flex items-center gap-2">
              <Icon name="book" /> {content.lessons} lecciones
            </span>
            <span className="rounded-full bg-red-500/30 px-4 py-1 text-sm">
              {content.difficulty}
            </span>
          </div>
        </header>

        <div className="mb-16 space-y-8">
          {content.topics.map((topic, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:bg-white/10"
            >
              <h2 className="mb-4 text-3xl font-bold text-green-400">
                {topic.name}
              </h2>
              <p className="mb-6 text-lg text-gray-300">{topic.description}</p>

              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-xl font-semibold text-blue-400">
                    Subtemas
                  </h3>
                  <ul className="space-y-3">
                    {topic.subtopics.map((sub, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-1 font-bold text-green-400">→</span>
                        <span className="text-gray-300">{sub}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="mb-4 text-xl font-semibold text-green-400">
                    Ejemplos
                  </h3>
                  <div className="space-y-3">
                    {topic.examples.map((example, i) => (
                      <div
                        key={i}
                        className="rounded border-l-4 border-green-400 bg-gray-900/50 p-4"
                      >
                        <code className="text-sm text-green-300">
                          {example}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="mb-16">
          <h2 className="mb-8 text-3xl font-bold text-cyan-400">
            Fórmulas Clave
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {content.keyFormulas.map((formula, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-6"
              >
                <code className="block text-center text-lg text-cyan-300">
                  {formula}
                </code>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-8 text-3xl font-bold text-purple-400">
            Ejercicios de Práctica
          </h2>
          <div className="space-y-4">
            {content.practiceExercises.map((exercise, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10"
              >
                <div className="flex items-start gap-4">
                  <span className="min-w-fit text-xl font-bold text-purple-400">
                    {idx + 1}.
                  </span>
                  <p className="text-gray-300">{exercise}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center">
          <Link
            href="/aprendizaje"
            className="inline-block rounded-xl bg-linear-to-r from-purple-600 to-purple-700 px-8 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-purple-800 hover:shadow-lg"
          >
            Volver al Aprendizaje
          </Link>
        </div>
      </div>
    </div>
  );
};
