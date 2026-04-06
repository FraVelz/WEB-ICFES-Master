import { cn } from '@/utils/cn';
import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';

export const Algebra = () => {
  const content = {
    title: 'Fundamentos de Álgebra Avanzada',
    duration: '6-7 horas',
    lessons: 28,
    difficulty: 'fácil-medio',
    topics: [
      {
        name: 'Ecuaciones Lineales',
        description:
          'Aprende a resolver ecuaciones de primer grado con una o más variables. ' +
          'Dominando técnicas de despeje y balanceo.',
        subtopics: [
          'Ecuaciones con una variable',
          'Ecuaciones con dos variables',
          'Sistemas de ecuaciones lineales',
          'Métodos de solución (sustitución, eliminación)',
        ],
        examples: ['2x + 5 = 13 → x = 4', '3x - 2y = 5 combinado con x + y = 4'],
      },
      {
        name: 'Sistemas de Ecuaciones',
        description: 'Resuelve conjuntos de ecuaciones simultáneamente usando múltiples métodos.',
        subtopics: ['Métodos de sustitución', 'Métodos de eliminación', 'Métodos gráficos', 'Sistemas 2x2 y 3x3'],
        examples: [
          'Sistema con solución única',
          'Sistema sin solución (inconsistente)',
          'Sistema con infinitas soluciones (dependiente)',
        ],
      },
      {
        name: 'Polinomios',
        description: 'Operaciones y factorización de expresiones algebraicas polinómicas.',
        subtopics: [
          'Suma, resta, multiplicación de polinomios',
          'Factorización básica',
          'Trinomios cuadráticos',
          'División sintética',
        ],
        examples: ['(x + 2)(x - 3) = x² - x - 6', 'x² + 5x + 6 = (x + 2)(x + 3)', 'Factorización por agrupación'],
      },
    ],
    keyFormulas: [
      'ax + b = 0 → x = -b/a',
      '(a + b)² = a² + 2ab + b²',
      '(a - b)² = a² - 2ab + b²',
      'a² - b² = (a + b)(a - b)',
    ],
    practiceExercises: [
      'Resolver 5x - 3 = 2x + 9',
      'Encontrar x e y: x + y = 7, 2x - y = 5',
      'Factorizar x² + 7x + 12',
      'Expandir (2x - 3)²',
    ],
  };

  return (
    <div className="min-h-dvh bg-linear-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-96 w-96 animate-pulse rounded-full bg-yellow-500/20 blur-3xl"></div>
        <div className="absolute right-1/4 bottom-0 h-96 w-96 animate-pulse rounded-full bg-orange-500/20 blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-10">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <Link
            href="/ruta-aprendizaje"
            className="flex items-center gap-3 text-gray-400 transition-colors hover:text-blue-400"
          >
            <Icon name="arrow-left" className="text-xl" />
            Volver
          </Link>
          <div className="text-right">
            <p className="text-sm text-gray-400">Matemáticas</p>
          </div>
        </div>

        {/* Hero Section */}
        <header className="mb-16 text-center">
          <div className="mb-6 flex items-center justify-center gap-4">
            <Icon name="ruler" className="text-5xl text-yellow-400" />
            <h1 className="bg-linear-to-r from-yellow-400 to-orange-400 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
              {content.title}
            </h1>
          </div>
          <div className="mb-8 flex justify-center gap-8 text-gray-300">
            <span className="flex items-center gap-2">
              <Icon name="ruler" /> {content.duration}
            </span>
            <span className="flex items-center gap-2">
              <Icon name="book" /> {content.lessons} lecciones
            </span>
            <span
              className={cn(
                'rounded-full px-4 py-1 text-sm',
                content.difficulty === 'fácil' ? 'bg-green-500/30' : 'bg-yellow-500/30'
              )}
            >
              {content.difficulty}
            </span>
          </div>
        </header>

        {/* Topics */}
        <div className="mb-16 space-y-8">
          {content.topics.map((topic, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:bg-white/10"
            >
              <h2 className="mb-4 text-3xl font-bold text-yellow-400">{topic.name}</h2>
              <p className="mb-6 text-lg text-gray-300">{topic.description}</p>

              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-xl font-semibold text-blue-400">Subtemas</h3>
                  <ul className="space-y-3">
                    {topic.subtopics.map((sub, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-1 font-bold text-yellow-400">→</span>
                        <span className="text-gray-300">{sub}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="mb-4 text-xl font-semibold text-green-400">Ejemplos</h3>
                  <div className="space-y-3">
                    {topic.examples.map((example, i) => (
                      <div key={i} className="rounded border-l-4 border-green-400 bg-gray-900/50 p-4">
                        <code className="text-sm text-green-300">{example}</code>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Formulas */}
        <section className="mb-16">
          <h2 className="mb-8 text-3xl font-bold text-cyan-400">Fórmulas Clave</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {content.keyFormulas.map((formula, idx) => (
              <div key={idx} className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-6">
                <code className="block text-center text-lg text-cyan-300">{formula}</code>
              </div>
            ))}
          </div>
        </section>

        {/* Practice */}
        <section className="mb-16">
          <h2 className="mb-8 text-3xl font-bold text-purple-400">Ejercicios de Práctica</h2>
          <div className="space-y-4">
            {content.practiceExercises.map((exercise, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10"
              >
                <div className="flex items-start gap-4">
                  <span className="min-w-fit text-xl font-bold text-purple-400">{idx + 1}.</span>
                  <p className="text-gray-300">{exercise}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Back Button */}
        <div className="text-center">
          <Link
            href="/ruta-aprendizaje"
            className={cn(
              'inline-block rounded-xl bg-linear-to-r from-purple-600 to-purple-700 px-8 py-3',
              'font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-purple-700',
              'hover:to-purple-800 hover:shadow-lg'
            )}
          >
            Volver al Aprendizaje
          </Link>
        </div>
      </div>
    </div>
  );
};
