import { cn } from '@/utils/cn';
import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';

export const Comprension = () => {
  const content = {
    title: 'Comprensión Lectora',
    duration: '7-8 horas',
    lessons: 25,
    difficulty: 'medio',
    topics: [
      {
        name: 'Análisis de Textos',
        description:
          'Técnicas avanzadas para identificar ideas principales, secundarias y propósito comunicativo del texto.',
        subtopics: [
          'Idea principal vs secundarias',
          'Propósito del autor',
          'Estructura del texto (inicio, desarrollo, conclusión)',
          'Tema e intención comunicativa',
          'Coherencia y cohesión textual',
          'Conectores y enlaces',
          'Tipos de párrafos (narrativo, argumentativo, descriptivo, expositivo)',
          'Topografía del texto',
        ],
        examples: [
          'Párrafo narrativo: ¿qué sucede? (hechos, acciones, eventos)',
          'Párrafo argumentativo: ¿qué intenta demostrar? (tesis, argumentos, conclusión)',
          'Párrafo descriptivo: ¿qué se describe? (características, cualidades)',
          'Párrafo expositivo: ¿qué se explica? (información, conceptos)',
          'Idea principal en noticia: primer párrafo resume la noticia',
          'Idea secundaria: detalles que complementan la principal',
        ],
      },
      {
        name: 'Inferencias y Deducción',
        description: 'Desarrollo de habilidades para deducir información implícita y hacer conclusiones lógicas.',
        subtopics: [
          'Inferencias por contexto',
          'Significado de palabras desconocidas por contexto',
          'Conclusiones lógicas basadas en evidencia',
          'Predecir continuaciones y desenlaces',
          'Análisis de causa y efecto',
          'Reconocimiento de supuestos implícitos',
          'Interpretación de tonalidad y actitud del autor',
          'Deducción de características de personajes',
        ],
        examples: [
          'Texto: "Era una noche fría y oscura, el viento aullaba entre las calles"',
          'Inferencia: contexto sombrío/misterioso/atemorizante',
          'Deducción: probablemente ocurrirá algo inquietante',
          'Causa: el frío extremo → Efecto: la gente se quedó en casa',
          'Supuesto implícito: si alguien cierra puertas y ventanas → tiene miedo',
          'Tonalidad: de horror, misterio, suspense',
        ],
      },
      {
        name: 'Vocabulario Contextual',
        description: 'Técnicas para determinar significados de palabras según el contexto y ampliar vocabulario.',
        subtopics: [
          'Sinónimos y antónimos en contexto',
          'Palabras polisémicas (múltiples significados)',
          'Expresiones idiomáticas',
          'Campos semánticos',
          'Palabras homógrafas y homófonas',
          'Raíces etimológicas',
          'Prefijos y sufijos',
          'Registros lingüísticos',
        ],
        examples: [
          'Banco (asiento vs institución vs corriente marina)',
          'Contexto determina significado: "El banco está junto al río"',
          'Expresiones: "llorar a mares" (llorar mucho), "costar un ojo de la cara" (muy caro)',
          'Campo semántico de TRANSPORTE: coche, autobús, tren, avión, barco',
          'Homógrafas: vela (prenda) vs vela (acción de velar)',
          'Prefijo re-: repetir, reconstruir, regresar',
        ],
      },
      {
        name: 'Tipos de Texto y Géneros',
        description: 'Análisis y características de diferentes tipos de textos literarios y no literarios.',
        subtopics: [
          'Textos narrativos (cuento, novela, crónica)',
          'Textos descriptivos',
          'Textos argumentativos',
          'Textos expositivos',
          'Textos informativos (noticias, reportajes)',
          'Textos instructivos',
          'Literatura infantil vs juvenil vs adulta',
          'Análisis de diálogos',
        ],
        examples: [
          'Narrativo: "Cuando María llegó a casa, encontró la puerta abierta"',
          'Descriptivo: "La casa era grande, con ventanas de madera y puertas de metal"',
          'Argumentativo: "Los smartphones son perjudiciales porque reducen la concentración"',
          'Instructivo: "Para preparar café, hierva agua y agregue café molido"',
        ],
      },
      {
        name: 'Estrategias de Lectura Crítica',
        description: 'Técnicas para analizar críticamente textos, identificar sesgos y evaluar credibilidad.',
        subtopics: [
          'Lectura exploratoria',
          'Lectura selectiva',
          'Lectura profunda/crítica',
          'Identificación de sesgos y prejuicios',
          'Evaluación de fuentes',
          'Análisis de la intencionalidad',
          'Reconocimiento de hechos vs opiniones',
          'Análisis de perspectivas contradictorias',
        ],
        examples: [
          'Sesgo: "Los políticos siempre mienten" (generalización)',
          'Hecho: "La ciudad tuvo 25 grados de temperatura ayer"',
          'Opinión: "Fue un día hermoso"',
          'Fuente confiable: artículo con referencias científicas',
          'Fuente no confiable: afirmaciones sin evidencia',
        ],
      },
    ],
    keyFormulas: [
      'Idea principal = respuesta a ¿de qué trata el texto?',
      'Inferencia = información implícita basada en evidencia contextual',
      'Contexto = claves para significados desconocidos',
      'Propósito = objetivo comunicativo del autor (informar, persuadir, entretener, instruir)',
      'Coherencia = relación lógica entre ideas',
      'Causa y Efecto = ¿por qué sucede? ¿qué sucede como resultado?',
    ],
    practiceExercises: [
      'Leer párrafos e identificar idea principal, secundarias y propósito',
      'Hacer inferencias sobre motivaciones y características de personajes',
      'Deducir significado de palabras desconocidas del contexto',
      'Identificar propósito textual: informar, persuadir, entretener, instruir',
      'Analizar relaciones de causa y efecto en textos narrativos',
      'Distinguir hechos de opiniones en textos argumentativos',
      'Crear mapas conceptuales de textos complejos',
      'Resumir textos identificando puntos clave',
      'Responder preguntas de comprensión profunda',
      'Analizar el tono y la actitud del autor',
    ],
  };

  return (
    <div className="min-h-dvh bg-linear-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/20 blur-3xl"></div>
        <div className="absolute right-1/4 bottom-0 h-96 w-96 animate-pulse rounded-full bg-cyan-500/20 blur-3xl"></div>
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
          <p className="text-sm text-gray-400">Lenguaje</p>
        </div>

        <header className="mb-16 text-center">
          <div className="mb-6 flex items-center justify-center gap-4">
            <Icon name="book" className="text-5xl text-blue-400" />
            <h1 className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
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
            <span className="rounded-full bg-yellow-500/30 px-4 py-1 text-sm">{content.difficulty}</span>
          </div>
        </header>

        <div className="mb-16 space-y-8">
          {content.topics.map((topic, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:bg-white/10"
            >
              <h2 className="mb-4 text-3xl font-bold text-blue-400">{topic.name}</h2>
              <p className="mb-6 text-lg text-gray-300">{topic.description}</p>

              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-xl font-semibold text-purple-400">Subtemas</h3>
                  <ul className="space-y-3">
                    {topic.subtopics.map((sub, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-1 font-bold text-blue-400">→</span>
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
                        <p className="text-sm text-green-300">{example}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="mb-16">
          <h2 className="mb-8 text-3xl font-bold text-cyan-400">Estrategias Clave</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {content.keyFormulas.map((formula, idx) => (
              <div key={idx} className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-6">
                <p className="text-center text-lg text-cyan-300">{formula}</p>
              </div>
            ))}
          </div>
        </section>

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

        <div className="text-center">
          <Link
            href="/aprendizaje"
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
