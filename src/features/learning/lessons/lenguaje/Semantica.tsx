import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';

export const Semantica = () => {
  const content = {
    title: 'Semántica y Etimología',
    duration: '7-8 horas',
    lessons: 22,
    difficulty: 'medio',
    topics: [
      {
        name: 'Significado de Palabras',
        description: 'Estudio profundo del significado léxico, contextual y sus variaciones.',
        subtopics: [
          'Denotación y connotación',
          'Significado literal vs figurado',
          'Palabras polisémicas',
          'Campos semánticos',
          'Palabras polivalentes',
          'Significado y contexto',
          'Variaciones de significado por registro',
          'Significado etimológico vs actual',
          'Cambios de significado en el tiempo',
          'Significados regionales',
        ],
        examples: [
          'Denotación: gato = animal felino domesticado, cuadrúpedo',
          'Connotación: gato = fuerza, elegancia, independencia, astucia',
          'Polisemia: banco (mueble para sentarse vs institución financiera vs corriente marina)',
          'Literal: "Me hierven la sangre" = sangre caliente',
          'Figurado: "Me hierven la sangre" = estoy muy enfadado',
          'Campo semántico FAMILIA: padre, madre, hermano, tío, primo',
          'Campo semántico COLORES: rojo, azul, verde, amarillo, naranja',
          'Campo semántico EMOCIONES: alegría, tristeza, miedo, rabia, esperanza',
          'Polivalencia: "correr" (movimiento rápido, participar en carrera, fluir como agua)',
          'Registro formal: "fallecimiento" vs Registro coloquial: "muerte"',
        ],
      },
      {
        name: 'Origen y Etimología de Palabras',
        description: 'Rastreo de la etimología e historia de palabras, influencias lingüísticas.',
        subtopics: [
          'Etimología latina y griega',
          'Palabras de origen árabe en español',
          'Palabras de origen germánico',
          'Palabras de origen indígena (americanas)',
          'Cambios fonéticos en el tiempo',
          'Influencias de otras lenguas',
          'Palabras cognadas',
          'Etimología falsa o popular',
          'Neologismos y palabras nuevas',
          'Arcaísmos y palabras obsoletas',
        ],
        examples: [
          'Padre (latín: pater → español: padre)',
          'Filosofía (griego: philos=amor + sophia=sabiduría)',
          'Influencia árabe: almohada, aceite, alfombra, alcohol, álgebra',
          'Cognadas: padre (español) - padre (italiano) - père (francés) - pater (latín)',
          'Germánico: guerra (germánico WERRA), guardia (germánico WARDA)',
          'Indígena: tomate, chocolate, cacao, jaguar',
          'Cambio fonético: latín CANEM → español PERRO (cambio irregular)',
          'Etimología falsa: "máscara" no viene de "más cara"',
          'Neologismo: "computadora, internet, teléfono móvil"',
          'Arcaísmo: "agora" (ahora antiguo), "vos" (tú arcaico en algunas regiones)',
        ],
      },
      {
        name: 'Sinónimos y Antónimos',
        description: 'Relaciones entre palabras con significados similares, opuestos o complementarios.',
        subtopics: [
          'Sinónimos totales',
          'Sinónimos parciales (cuasi-sinónimos)',
          'Antónimos absolutos',
          'Antónimos relativos',
          'Niveles de registro lingüístico',
          'Precisión léxica',
          'Sinónimos por contexto',
          'Matices de significado',
          'Sinonimia figurada',
          'Antonimia parcial',
        ],
        examples: [
          'Sinónimos: hermoso ≈ bonito ≈ lindo (pero con matices)',
          'Cuasi-sinónimos: comenzar, empezar, iniciar (ligeramente diferentes)',
          'Antónimos absolutos: blanco ↔ negro, frío ↔ caliente',
          'Antónimos relativos: grande ↔ pequeño (depende del contexto)',
          'Sinónimo coloquial: "coche" vs formal: "automóvil"',
          'Precisión: "joven" (impreciso) vs "adolescente, muchacho, chaval" (preciso)',
          'Matiz: "delgado" (positivo) vs "flaco" (negativo) vs "esbelto" (muy positivo)',
          'Riqueza léxica: "triste" (genérico) vs "melancólico, apesadumbrado, desconsolado"',
          'Sinonimia figurada: "muerte" ≈ "eterno descanso"',
          'Antonimia parcial: "largo" se opone a "corto" pero existen "mediano, regular"',
        ],
      },
      {
        name: 'Relaciones Semánticas Complejas',
        description: 'Análisis de relaciones sutiles entre significados de palabras.',
        subtopics: [
          'Hiperónimos e hipónimos',
          'Holónimos y merónimos',
          'Palabras relacionadas por asociación',
          'Homónimos, homógrafos, homófonos',
          'Parónimos',
          'Palabras con raíz común',
          'Familias léxicas',
          'Fraseología y expresiones fijas',
          'Modismos regionais',
          'Equivalencias culturales',
        ],
        examples: [
          'Hiperónimo: "animal" (general) → Hipónimo: "perro" (específico)',
          'Holónimo: "árbol" (todo) → Merónimo: "rama, tronco, hoja" (partes)',
          'Homonimia: "banco" (mueble vs institución) - homógrafo (ortografía igual)',
          'Homófono: "ciento" vs "ciento" (pronunciación igual, diferente escritura)',
          'Parónimo: "afección" vs "infección" (escritura similar, significado diferente)',
          'Familia léxica: "libro, librería, libreta, librero, libretista"',
          'Fraseología: "al fin y al cabo", "en resumidas cuentas"',
          'Modismo: "estar en la luna", "tener pájaros en la cabeza"',
          'Equivalencia cultural: "siesta" en español ≈ "nap" en inglés',
          'Asociación: "fuego" → calor, llama, peligro, pasión',
        ],
      },
      {
        name: 'Análisis Semántico Aplicado',
        description: 'Aplicación práctica del análisis semántico en textos y comunicación.',
        subtopics: [
          'Análisis de campos semánticos en textos',
          'Coherencia semántica',
          'Coherencia textual',
          'Ambigüedad semántica',
          'Resolución de ambigüedad',
          'Elipsis semántica',
          'Ironía semántica',
          'Doble sentido',
          'Juegos de palabras',
          'Publicidad y manipulación semántica',
        ],
        examples: [
          'Campo semántico en texto: análisis de sinónimos usados',
          'Coherencia: todas las palabras contribuyen a significado unificado',
          'Ambigüedad: "Vi al hombre con el telescopio" (¿quién tiene el telescopio?)',
          'Resolución: "Vi al hombre (que tenía) el telescopio"',
          'Elipsis: "María es inteligente y (Juan es) trabajador"',
          'Ironía: "¡Qué inteligente!" (dice alguien tonto) = crítica implícita',
          'Doble sentido: "¿Quieres que te dé mi número?" (teléfono vs atención)',
          'Juego de palabras: "Soy un abogado (abogado por algo) y un abogado (profesional)"',
          'Publicidad: "Nuestro producto es lo más" (implicación de excelencia)',
        ],
      },
    ],
    keyFormulas: [
      'Denotación = significado literal y objetivo, diccionario',
      'Connotación = significado subjetivo, emocional, contextual',
      'Etimología = origen e historia de la palabra',
      'Sinónimo = palabras con significado similar (pero no idéntico)',
      'Antónimo = palabras con significado opuesto',
      'Campo semántico = conjunto de palabras con significados relacionados',
      'Hiperónimo = término general que incluye otros términos (animal > perro)',
      'Hipónimo = término específico incluido en uno general (perro < animal)',
    ],
    practiceExercises: [
      'Encontrar sinónimos precisos para palabras en contexto',
      'Identificar matices de significado entre sinónimos',
      'Clasificar palabras en campos semánticos',
      'Identificar denotación vs connotación en textos',
      'Rastrear etimología de palabras comunes',
      'Resolver crucigramas semánticos',
      'Analizar campos semánticos en prosas literarias',
      'Identificar y resolver ambigüedades semánticas',
      'Crear mapas mentales de familias léxicas',
      'Analizar homónimos y parónimos en textos',
      'Estudiar cambios semánticos en palabras',
      'Interpretar dobles sentidos y juegos de palabras',
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
          <h2 className="mb-8 text-3xl font-bold text-cyan-400">Conceptos Clave</h2>
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
            className="inline-block rounded-xl bg-linear-to-r from-purple-600 to-purple-700 px-8 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-purple-800 hover:shadow-lg"
          >
            Volver al Aprendizaje
          </Link>
        </div>
      </div>
    </div>
  );
};
