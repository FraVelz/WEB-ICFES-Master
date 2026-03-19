import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';

export const Literatura = () => {
  const content = {
    title: 'Literatura',
    duration: '10-11 horas',
    lessons: 30,
    difficulty: 'medio-alto',
    topics: [
      {
        name: 'Figuras Literarias y Recursos Estilísticos',
        description:
          'Estudio exhaustivo de recursos retóricos para enriquecer la expresión literaria.',
        subtopics: [
          'Metáfora y comparación (símil)',
          'Hipérbole y litote',
          'Personificación (prosopopeya)',
          'Aliteración y onomatopeya',
          'Metonimia y sinécdoque',
          'Paradoja y oxímoron',
          'Ironía y sarcasmo',
          'Anáfora, epífrasis y quiasmo',
          'Hipérbaton y elipsis',
          'Juego de palabras y cacofonía',
        ],
        examples: [
          'Metáfora: "eres mi sol" (comparación implícita)',
          'Símil: "blanco como la nieve" (comparación explícita)',
          'Hipérbole: "te lo he dicho mil veces" (exageración)',
          'Litote: "no es malo" (atenuación)',
          'Personificación: "la noche suspiraba" (atributos humanos)',
          'Aliteración: "El susurro del silencio" (repetición de sonidos)',
          'Onomatopeya: "crac, pum, zzz" (imitación de sonidos)',
          'Metonimia: "Bebió dos copas" (recipiente por contenido)',
          'Sinécdoque: "Llegaron cien cabezas" (parte por todo)',
          'Paradoja: "menos es más" (contradicción aparente)',
          'Oxímoron: "hermoso horror" (palabra contradictoria)',
          'Ironía: Decir algo con intención opuesta al significado',
          'Anáfora: "Volverán las oscuras golondrinas" (repetición inicial)',
        ],
      },
      {
        name: 'Géneros Literarios Principales',
        description:
          'Análisis profundo de características, tipos y ejemplos de géneros literarios.',
        subtopics: [
          'Narrativa: novela, cuento, crónica, fábula, leyenda',
          'Poesía: verso, prosa poética, poema épico',
          'Drama: tragedia, comedia, melodrama, tragicomedia',
          'Ensayo: formal, personal, científico',
          'Textos expositivos y descriptivos',
          'Subgéneros narrativos',
          'Estructura interna de géneros',
          'Voz narrativa y perspectiva',
          'Punto de vista del narrador',
          'Tiempo y espacio narrativo',
        ],
        examples: [
          'Novela: extensión variable, complejidad de caracteres, trama compleja',
          'Cuento: brevedad, concentración de la acción, desenlace sorpresivo',
          'Poesía: ritmo, rima, métrica, musicalidad',
          'Drama: diálogos, acciones, conflicto entre personajes',
          'Tragedia: final desgraciado, protagonista noble',
          'Comedia: final feliz, tono humorístico',
          'Ensayo: reflexión personal sobre tema',
          'Fábula: historia breve con moraleja',
          'Leyenda: narración tradicional, mezcla de real e imaginario',
          'Epopeya: poema narrativo de acciones heroicas',
        ],
      },
      {
        name: 'Autores Clásicos Hispanohablantes',
        description:
          'Estudio profundo de obras y contribuciones de grandes escritores.',
        subtopics: [
          'Autores españoles medievales y renacentistas',
          'Autores españoles del Siglo de Oro',
          'Autores españoles modernistas y contemporáneos',
          'Autores latinoamericanos coloniales',
          'Autores latinoamericanos modernistas',
          'Autores latinoamericanos del siglo XX',
          'Autores hispanohablantes contemporáneos',
          'Movimientos literarios: Renacimiento, Barroco, Romanticismo, Realismo, Modernismo',
          'Contexto histórico y literario',
          'Influencias mutuas entre autores',
        ],
        examples: [
          'Quijote - Cervantes (novela moderna, sátira de libros de caballerías)',
          'Cien años de soledad - García Márquez (realismo mágico)',
          'La casa de Bernarda Alba - Lorca (drama moderno, represión social)',
          'Don Juan - José Zorrilla (drama romántico)',
          'Rimas - Gustavo Adolfo Bécquer (poesía romántica)',
          'El poema del Cid - Anónimo (poema épico medieval)',
          'La Celestina - Fernando de Rojas (tragicomedia renacentista)',
          'Campos de Castilla - Antonio Machado (poesía generación 98)',
          'Rayuela - Julio Cortázar (novela experimental)',
          'El laberinto de la soledad - Octavio Paz (ensayo)',
        ],
      },
      {
        name: 'Elementos de la Narrativa',
        description:
          'Análisis detallado de componentes fundamentales de relatos literarios.',
        subtopics: [
          'Personajes: protagonista, antagonista, secundarios',
          'Caracterización: física, psicológica, social',
          'Desarrollo de personajes: estático vs dinámico',
          'Trama y argumento',
          'Nudo, desenlace y conflicto',
          'Tiempo narrativo: lineal, no lineal, circular',
          'Espacio: físico, psicológico, social',
          'Atmósfera y ambiente',
          'Voz narrativa: primera, segunda, tercera persona',
          'Narrador omnisciente, objetivo, limitado',
        ],
        examples: [
          'Protagonista: personaje principal',
          'Antagonista: se opone al protagonista',
          'Trama principal vs subtrama',
          'Conflicto externo: lucha contra enemigos/circunstancias',
          'Conflicto interno: lucha consigo mismo',
          'Tiempo lineal: narrativa cronológica',
          'Flashback: salto al pasado',
          'Prolepsis: adelanto de eventos futuros',
          'Espacio cerrado: casa, prison (claustrofóbico)',
          'Espacio abierto: campo, ciudad (libertad)',
        ],
      },
      {
        name: 'Análisis de Poesía',
        description:
          'Técnicas para analizar y comprender poesía: métrica, rima, ritmo y significado.',
        subtopics: [
          'Métrica: sílabas, pies, versos',
          'Rima: consonante, asonante, libre',
          'Ritmo y cadencia',
          'Estrofas: cuarteta, terceto, soneto, lira',
          'Cesura y encabalgamiento',
          'Tema poético y voz lírica',
          'Registro poético: culto, popular',
          'Tonalidad: lírica, épica, satírica',
          'Poesía narrativa vs poesía lírica',
          'Interpretación y simbolismo',
        ],
        examples: [
          'Endecasílabo: verso de 11 sílabas',
          'Octosílabo: verso de 8 sílabas',
          'Rima consonante: gato-rato (suenan igual)',
          'Rima asonante: vino-sigo (solo vocales)',
          'Soneto: 14 versos en cuartetas y tercetos',
          'Lira: 5 versos de 7 y 11 sílabas',
          'Encabalgamiento: verso continúa en el siguiente',
          'Cesura: pausa dentro del verso',
          'Yo lírico: la voz del poeta en el poema',
          'Símbolo: palabra con significado adicional',
        ],
      },
    ],
    keyFormulas: [
      'Metáfora = comparación sin "como"',
      'Símil = comparación con "como"',
      'Aliteración = repetición de sonidos consonantes',
      'Genero literario = novela, drama, poesía, ensayo',
      'Trama = secuencia de eventos (qué sucede)',
      'Argumento = significado de los eventos (por qué importa)',
      'Métrica = estructura silábica del verso',
      'Rima = repetición de sonidos finales',
    ],
    practiceExercises: [
      'Identificar figuras literarias en textos y explicar su efecto',
      'Clasificar obras en géneros y justificar la clasificación',
      'Analizar estilo, lenguaje y técnicas de autores clásicos',
      'Crear ejemplos originales de figuras literarias',
      'Analizar la caracterización de personajes en obras',
      'Interpretar el significado simbólico de elementos narrativos',
      'Contar un acento: sílabas y clasificación de versos',
      'Identificar tipos de rima en poesía',
      'Analizar la estructura de estrofas (cuarteta, terceto, soneto)',
      'Comparar técnicas literarias entre autores diferentes',
      'Realizar análisis crítico de obras completas',
      'Escribir breves análisis literarios de fragmentos',
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
            <Icon name="arrow-left" size="xl" className="text-xl" />
            Volver
          </Link>
          <p className="text-sm text-gray-400">Lenguaje</p>
        </div>

        <header className="mb-16 text-center">
          <div className="mb-6 flex items-center justify-center gap-4">
            <Icon name="book" size="3xl" className="text-5xl text-blue-400" />
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
            <span className="rounded-full bg-yellow-500/30 px-4 py-1 text-sm">
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
              <h2 className="mb-4 text-3xl font-bold text-blue-400">
                {topic.name}
              </h2>
              <p className="mb-6 text-lg text-gray-300">{topic.description}</p>

              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-xl font-semibold text-purple-400">
                    Subtemas
                  </h3>
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
                  <h3 className="mb-4 text-xl font-semibold text-green-400">
                    Ejemplos
                  </h3>
                  <div className="space-y-3">
                    {topic.examples.map((example, i) => (
                      <div
                        key={i}
                        className="rounded border-l-4 border-green-400 bg-gray-900/50 p-4"
                      >
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
          <h2 className="mb-8 text-3xl font-bold text-cyan-400">
            Conceptos Clave
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {content.keyFormulas.map((formula, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-6"
              >
                <p className="text-center text-lg text-cyan-300">{formula}</p>
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
