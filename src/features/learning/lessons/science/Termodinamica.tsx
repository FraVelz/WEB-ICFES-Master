import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';

export const Termodinamica = () => {
  const content = {
    title: 'Termodinámica y Termoquímica Avanzada', duration: '8-9 horas', lessons: 24, difficulty: 'muy difícil', topics: [
      {
        name: 'Calor y Temperatura', description: 'Conceptos fundamentales de temperatura, calor y equilibrio térmico.', subtopics: [
          'Temperatura y energía cinética', 'Transferencia de calor', 'Modos de transferencia: conducción, convección, radiación', 'Dilatación térmica'
        ], examples: [
          'T(K) = T(°C) + 273', 'Q = m·c·ΔT', 'Conducción en metales, convección en fluidos'
        ]
      }, {
        name: 'Leyes de la Termodinámica', description: 'Principios fundamentales que rigen los procesos termodinámicos.', subtopics: [
          'Primera ley: conservación de energía', 'Segunda ley: entropía', 'Tercera ley: cero absoluto', 'Máquinas térmicas'
        ], examples: [
          'ΔU = Q - W (primera ley)', 'ΔS ≥ 0 (segunda ley)', 'Eficiencia: η = W/Q_entrada'
        ]
      }, {
        name: 'Entropía', description: 'Concepto de desorden y dirección de procesos naturales.', subtopics: [
          'Definición de entropía', 'Orden y desorden molecular', 'Espontaneidad de procesos', 'Relación con energía libre de Gibbs'
        ], examples: [
          'Entropía aumenta en sistemas aislados', 'Gas se expande espontáneamente', 'Cristales se disuelven en agua'
        ]
      }
    ], keyFormulas: [
      'Q = m·c·ΔT (calor)', 'ΔU = Q - W (primera ley)', 'W = P·ΔV (trabajo)', 'η = 1 - Q_fría/Q_caliente (eficiencia)', 'ΔG = ΔH - T·ΔS'
    ], practiceExercises: [
      'Calcular calor necesario para elevar T de agua', 'Aplicar primera ley a sistema de gas', 'Calcular trabajo realizado en expansión', 'Determinar espontaneidad de reacción'
    ]
  };

  return (
    <div className="min-h-dvh bg-linear-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-12">
          <Link href="/aprendizaje" className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition-colors">
            <Icon name="arrow-left" size="xl" className="text-xl" />
            Volver
          </Link>
          <p className="text-sm text-gray-400">Ciencias Naturales</p>
        </div>

        <header className="mb-16 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Icon name="flask" size="3xl" className="text-5xl text-green-400" />
            <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              {content.title}
            </h1>
          </div>
          <div className="flex justify-center gap-8 text-gray-300 mb-8">
            <span className="flex items-center gap-2"><Icon name="clock" /> {content.duration}</span>
            <span className="flex items-center gap-2"><Icon name="book" /> {content.lessons} lecciones</span>
            <span className="px-4 py-1 rounded-full bg-red-500/30 text-sm">{content.difficulty}</span>
          </div>
        </header>

        <div className="space-y-8 mb-16">
          {content.topics.map((topic, idx) => (
            <div key={idx} className="p-8 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 rounded-2xl transition-all">
              <h2 className="text-3xl font-bold text-green-400 mb-4">{topic.name}</h2>
              <p className="text-gray-300 mb-6 text-lg">{topic.description}</p>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-blue-400 mb-4">Subtemas</h3>
                  <ul className="space-y-3">
                    {topic.subtopics.map((sub, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-green-400 font-bold mt-1">→</span>
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

        <div className="text-center">
          <Link href="/aprendizaje" className="inline-block bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105">
            Volver al Aprendizaje
          </Link>
        </div>
      </div>
    </div>
  );
};
