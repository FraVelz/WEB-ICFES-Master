import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faArrowLeft, faBook, faClock } from '@fortawesome/free-solid-svg-icons';

export const Filosofia = () => {
  const content = {
    title: 'Filosofía y Ética', duration: '8-9 horas', lessons: 21, difficulty: 'difícil', topics: [
      {
        name: 'Teorías Éticas', description: 'Principales teorías sobre la moral y lo correcto.', subtopics: [
          'Deontología: deber y normas', 'Consecuencialismo: utilitarismo', 'Ética de virtudes', 'Ética contemporánea'
        ], examples: [
          'Kant: deber como fundamento', 'Utilitarismo: máxima felicidad', 'Aristóteles: virtudes y hábitos'
        ]
      }, {
        name: 'Metafísica', description: 'Preguntas fundamentales sobre la realidad y el ser.', subtopics: [
          '¿Qué es la realidad?', 'Sustancia y propiedades', 'Causa y efecto', 'Liberta versus determinismo'
        ], examples: [
          'Realismo: mundo existe independiente', 'Idealismo: realidad depende de mente', 'Causalidad: relación causa-efecto'
        ]
      }, {
        name: 'Epistemología', description: 'Estudio del conocimiento y cómo sabemos lo que sabemos.', subtopics: [
          'Fundamentos del conocimiento', 'Verdad y justificación', 'Escepticismo y relativismo', 'Método científico'
        ], examples: [
          'Empirismo: conocimiento por experiencia', 'Racionalismo: conocimiento por razón', 'Ciencia: método empírico-deductivo'
        ]
      }
    ], keyFormulas: [
      'Ética = Ciencia de la moral', 'Virtud = Hábito de obrar bien', 'Conocimiento = Creencia verdadera justificada', 'Realidad = Lo que existe independientemente'
    ], practiceExercises: [
      'Analizar dilema ético desde diferentes teorías', 'Debatir sobre libertad versus determinismo', 'Comparar empirismo vs racionalismo', 'Evaluar criterios de verdad'
    ]
  };

  return (
    <div className="min-h-[100dvh] bg-linear-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-12">
          <Link to="/aprendizaje" className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition-colors">
            <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
            Volver
          </Link>
          <p className="text-sm text-gray-400">Sociales y Ciudadanas</p>
        </div>

        <header className="mb-16 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <FontAwesomeIcon icon={faGlobe} className="text-5xl text-orange-400" />
            <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              {content.title}
            </h1>
          </div>
          <div className="flex justify-center gap-8 text-gray-300 mb-8">
            <span className="flex items-center gap-2"><FontAwesomeIcon icon={faClock} /> {content.duration}</span>
            <span className="flex items-center gap-2"><FontAwesomeIcon icon={faBook} /> {content.lessons} lecciones</span>
            <span className="px-4 py-1 rounded-full bg-red-500/30 text-sm">{content.difficulty}</span>
          </div>
        </header>

        <div className="space-y-8 mb-16">
          {content.topics.map((topic, idx) => (
            <div key={idx} className="p-8 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 rounded-2xl transition-all">
              <h2 className="text-3xl font-bold text-orange-400 mb-4">{topic.name}</h2>
              <p className="text-gray-300 mb-6 text-lg">{topic.description}</p>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-blue-400 mb-4">Subtemas</h3>
                  <ul className="space-y-3">
                    {topic.subtopics.map((sub, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-orange-400 font-bold mt-1">→</span>
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
                        <p className="text-green-300 text-sm">{example}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-cyan-400 mb-8">Definiciones Clave</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {content.keyFormulas.map((formula, idx) => (
              <div key={idx} className="p-6 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                <p className="text-cyan-300 text-center text-lg">{formula}</p>
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
          <Link to="/aprendizaje" className="inline-block bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105">
            Volver al Aprendizaje
          </Link>
        </div>
      </div>
    </div>
  );
};
