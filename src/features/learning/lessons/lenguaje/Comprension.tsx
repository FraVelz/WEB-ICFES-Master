import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faArrowLeft, faClock } from '@fortawesome/free-solid-svg-icons';

export const Comprension = () => {
  const content = {
    title: 'Comprensión Lectora', duration: '7-8 horas', lessons: 25, difficulty: 'medio', topics: [
      {
        name: 'Análisis de Textos', description: 'Técnicas avanzadas para identificar ideas principales, secundarias y propósito comunicativo del texto.', subtopics: [
          'Idea principal vs secundarias', 'Propósito del autor', 'Estructura del texto (inicio, desarrollo, conclusión)', 'Tema e intención comunicativa', 'Coherencia y cohesión textual', 'Conectores y enlaces', 'Tipos de párrafos (narrativo, argumentativo, descriptivo, expositivo)', 'Topografía del texto'
        ], examples: [
          'Párrafo narrativo: ¿qué sucede? (hechos, acciones, eventos)', 'Párrafo argumentativo: ¿qué intenta demostrar? (tesis, argumentos, conclusión)', 'Párrafo descriptivo: ¿qué se describe? (características, cualidades)', 'Párrafo expositivo: ¿qué se explica? (información, conceptos)', 'Idea principal en noticia: primer párrafo resume la noticia', 'Idea secundaria: detalles que complementan la principal'
        ]
      }, {
        name: 'Inferencias y Deducción', description: 'Desarrollo de habilidades para deducir información implícita y hacer conclusiones lógicas.', subtopics: [
          'Inferencias por contexto', 'Significado de palabras desconocidas por contexto', 'Conclusiones lógicas basadas en evidencia', 'Predecir continuaciones y desenlaces', 'Análisis de causa y efecto', 'Reconocimiento de supuestos implícitos', 'Interpretación de tonalidad y actitud del autor', 'Deducción de características de personajes'
        ], examples: [
          'Texto: "Era una noche fría y oscura, el viento aullaba entre las calles"', 'Inferencia: contexto sombrío/misterioso/atemorizante', 'Deducción: probablemente ocurrirá algo inquietante', 'Causa: el frío extremo → Efecto: la gente se quedó en casa', 'Supuesto implícito: si alguien cierra puertas y ventanas → tiene miedo', 'Tonalidad: de horror, misterio, suspense'
        ]
      }, {
        name: 'Vocabulario Contextual', description: 'Técnicas para determinar significados de palabras según el contexto y ampliar vocabulario.', subtopics: [
          'Sinónimos y antónimos en contexto', 'Palabras polisémicas (múltiples significados)', 'Expresiones idiomáticas', 'Campos semánticos', 'Palabras homógrafas y homófonas', 'Raíces etimológicas', 'Prefijos y sufijos', 'Registros lingüísticos'
        ], examples: [
          'Banco (asiento vs institución vs corriente marina)', 'Contexto determina significado: "El banco está junto al río"', 'Expresiones: "llorar a mares" (llorar mucho), "costar un ojo de la cara" (muy caro)', 'Campo semántico de TRANSPORTE: coche, autobús, tren, avión, barco', 'Homógrafas: vela (prenda) vs vela (acción de velar)', 'Prefijo re-: repetir, reconstruir, regresar'
        ]
      }, {
        name: 'Tipos de Texto y Géneros', description: 'Análisis y características de diferentes tipos de textos literarios y no literarios.', subtopics: [
          'Textos narrativos (cuento, novela, crónica)', 'Textos descriptivos', 'Textos argumentativos', 'Textos expositivos', 'Textos informativos (noticias, reportajes)', 'Textos instructivos', 'Literatura infantil vs juvenil vs adulta', 'Análisis de diálogos'
        ], examples: [
          'Narrativo: "Cuando María llegó a casa, encontró la puerta abierta"', 'Descriptivo: "La casa era grande, con ventanas de madera y puertas de metal"', 'Argumentativo: "Los smartphones son perjudiciales porque reducen la concentración"', 'Instructivo: "Para preparar café, hierva agua y agregue café molido"'
        ]
      }, {
        name: 'Estrategias de Lectura Crítica', description: 'Técnicas para analizar críticamente textos, identificar sesgos y evaluar credibilidad.', subtopics: [
          'Lectura exploratoria', 'Lectura selectiva', 'Lectura profunda/crítica', 'Identificación de sesgos y prejuicios', 'Evaluación de fuentes', 'Análisis de la intencionalidad', 'Reconocimiento de hechos vs opiniones', 'Análisis de perspectivas contradictorias'
        ], examples: [
          'Sesgo: "Los políticos siempre mienten" (generalización)', 'Hecho: "La ciudad tuvo 25 grados de temperatura ayer"', 'Opinión: "Fue un día hermoso"', 'Fuente confiable: artículo con referencias científicas', 'Fuente no confiable: afirmaciones sin evidencia'
        ]
      }
    ], keyFormulas: [
      'Idea principal = respuesta a ¿de qué trata el texto?', 'Inferencia = información implícita basada en evidencia contextual', 'Contexto = claves para significados desconocidos', 'Propósito = objetivo comunicativo del autor (informar, persuadir, entretener, instruir)', 'Coherencia = relación lógica entre ideas', 'Causa y Efecto = ¿por qué sucede? ¿qué sucede como resultado?'
    ], practiceExercises: [
      'Leer párrafos e identificar idea principal, secundarias y propósito', 'Hacer inferencias sobre motivaciones y características de personajes', 'Deducir significado de palabras desconocidas del contexto', 'Identificar propósito textual: informar, persuadir, entretener, instruir', 'Analizar relaciones de causa y efecto en textos narrativos', 'Distinguir hechos de opiniones en textos argumentativos', 'Crear mapas conceptuales de textos complejos', 'Resumir textos identificando puntos clave', 'Responder preguntas de comprensión profunda', 'Analizar el tono y la actitud del autor'
    ]
  };

  return (
    <div className="min-h-dvh bg-linear-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-12">
          <Link href="/aprendizaje" className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition-colors">
            <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
            Volver
          </Link>
          <p className="text-sm text-gray-400">Lenguaje</p>
        </div>

        <header className="mb-16 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <FontAwesomeIcon icon={faBook} className="text-5xl text-blue-400" />
            <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {content.title}
            </h1>
          </div>
          <div className="flex justify-center gap-8 text-gray-300 mb-8">
            <span className="flex items-center gap-2"><FontAwesomeIcon icon={faClock} /> {content.duration}</span>
            <span className="flex items-center gap-2"><FontAwesomeIcon icon={faBook} /> {content.lessons} lecciones</span>
            <span className="px-4 py-1 rounded-full bg-yellow-500/30 text-sm">{content.difficulty}</span>
          </div>
        </header>

        <div className="space-y-8 mb-16">
          {content.topics.map((topic, idx) => (
            <div key={idx} className="p-8 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 rounded-2xl transition-all">
              <h2 className="text-3xl font-bold text-blue-400 mb-4">{topic.name}</h2>
              <p className="text-gray-300 mb-6 text-lg">{topic.description}</p>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-purple-400 mb-4">Subtemas</h3>
                  <ul className="space-y-3">
                    {topic.subtopics.map((sub, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-blue-400 font-bold mt-1">→</span>
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
          <h2 className="text-3xl font-bold text-cyan-400 mb-8">Estrategias Clave</h2>
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
          <Link href="/aprendizaje" className="inline-block bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105">
            Volver al Aprendizaje
          </Link>
        </div>
      </div>
    </div>
  );
};
