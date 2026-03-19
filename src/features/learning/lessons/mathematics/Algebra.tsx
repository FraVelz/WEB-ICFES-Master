import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRuler, faArrowLeft, faBook } from '@fortawesome/free-solid-svg-icons';

export const Algebra = () => {
  const content = {
    title: 'Fundamentos de Álgebra Avanzada',
    duration: '6-7 horas',
    lessons: 28,
    difficulty: 'fácil-medio',
    topics: [
      {
        name: 'Ecuaciones Lineales',
        description: 'Aprende a resolver ecuaciones de primer grado con una o más variables. Dominando técnicas de despeje y balanceo.',
        subtopics: [
          'Ecuaciones con una variable',
          'Ecuaciones con dos variables',
          'Sistemas de ecuaciones lineales',
          'Métodos de solución (sustitución, eliminación)'
        ],
        examples: [
          '2x + 5 = 13 → x = 4',
          '3x - 2y = 5 combinado con x + y = 4'
        ]
      },
      {
        name: 'Sistemas de Ecuaciones',
        description: 'Resuelve conjuntos de ecuaciones simultáneamente usando múltiples métodos.',
        subtopics: [
          'Métodos de sustitución',
          'Métodos de eliminación',
          'Métodos gráficos',
          'Sistemas 2x2 y 3x3'
        ],
        examples: [
          'Sistema con solución única',
          'Sistema sin solución (inconsistente)',
          'Sistema con infinitas soluciones (dependiente)'
        ]
      },
      {
        name: 'Polinomios',
        description: 'Operaciones y factorización de expresiones algebraicas polinómicas.',
        subtopics: [
          'Suma, resta, multiplicación de polinomios',
          'Factorización básica',
          'Trinomios cuadráticos',
          'División sintética'
        ],
        examples: [
          '(x + 2)(x - 3) = x² - x - 6',
          'x² + 5x + 6 = (x + 2)(x + 3)',
          'Factorización por agrupación'
        ]
      }
    ],
    keyFormulas: [
      'ax + b = 0 → x = -b/a',
      '(a + b)² = a² + 2ab + b²',
      '(a - b)² = a² - 2ab + b²',
      'a² - b² = (a + b)(a - b)'
    ],
    practiceExercises: [
      'Resolver 5x - 3 = 2x + 9',
      'Encontrar x e y: x + y = 7, 2x - y = 5',
      'Factorizar x² + 7x + 12',
      'Expandir (2x - 3)²'
    ]
  };

  return (
    <div className="min-h-dvh bg-linear-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/aprendizaje" className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition-colors">
            <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
            Volver
          </Link>
          <div className="text-right">
            <p className="text-sm text-gray-400">Matemáticas</p>
          </div>
        </div>

        {/* Hero Section */}
        <header className="mb-16 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <FontAwesomeIcon icon={faRuler} className="text-5xl text-yellow-400" />
            <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              {content.title}
            </h1>
          </div>
          <div className="flex justify-center gap-8 text-gray-300 mb-8">
            <span className="flex items-center gap-2"><FontAwesomeIcon icon={faRuler} /> {content.duration}</span>
            <span className="flex items-center gap-2"><FontAwesomeIcon icon={faBook} /> {content.lessons} lecciones</span>
            <span className={`px-4 py-1 rounded-full ${content.difficulty === 'fácil' ? 'bg-green-500/30' : 'bg-yellow-500/30'} text-sm`}>
              {content.difficulty}
            </span>
          </div>
        </header>

        {/* Topics */}
        <div className="space-y-8 mb-16">
          {content.topics.map((topic, idx) => (
            <div key={idx} className="p-8 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 rounded-2xl transition-all">
              <h2 className="text-3xl font-bold text-yellow-400 mb-4">{topic.name}</h2>
              <p className="text-gray-300 mb-6 text-lg">{topic.description}</p>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-blue-400 mb-4">Subtemas</h3>
                  <ul className="space-y-3">
                    {topic.subtopics.map((sub, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-yellow-400 font-bold mt-1">→</span>
                        <span className="text-gray-300">{sub}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-green-400 mb-4">Ejemplos</h3>
                  <div className="space-y-3">
                    {topic.examples.map((example, i) => (
                      <div key={i} className="p-4 bg-gray-900/50 border-l-4 border-green-400 rounded">
                        <code className="text-green-300 text-sm">{example}</code>
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
          <h2 className="text-3xl font-bold text-cyan-400 mb-8">Fórmulas Clave</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {content.keyFormulas.map((formula, idx) => (
              <div key={idx} className="p-6 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                <code className="text-cyan-300 text-center block text-lg">{formula}</code>
              </div>
            ))}
          </div>
        </section>

        {/* Practice */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-purple-400 mb-8">Ejercicios de Práctica</h2>
          <div className="space-y-4">
            {content.practiceExercises.map((exercise, idx) => (
              <div key={idx} className="p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                <div className="flex items-start gap-4">
                  <span className="font-bold text-purple-400 text-xl min-w-fit">{idx + 1}.</span>
                  <p className="text-gray-300">{exercise}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Back Button */}
        <div className="text-center">
          <Link
            href="/aprendizaje"
            className="inline-block bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            Volver al Aprendizaje
          </Link>
        </div>
      </div>
    </div>
  );
};
