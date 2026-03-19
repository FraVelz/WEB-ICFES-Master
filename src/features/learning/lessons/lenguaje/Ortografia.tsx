import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';

export const Ortografia = () => {
  const content = {
    title: 'Ortografía y Puntuación',
    duration: '6-7 horas',
    lessons: 24,
    difficulty: 'fácil-medio',
    topics: [
      {
        name: 'Reglas Ortográficas Complejas',
        description:
          'Reglas exhaustivas para la escritura correcta de palabras en español.',
        subtopics: [
          'Uso de b/v: reglas diferenciadas',
          'Uso de c/s/z: contextos de uso',
          'Uso de g/j: reglas y excepciones',
          'Uso de h: palabras con h y sin h',
          'Uso de ll/y: distinción dialectal',
          'Palabras homófonas y parónimas',
          'Mayúsculas y minúsculas',
          'Divisiones silábicas',
          'Palabras de dudosa escritura',
          'Prefijos y sufijos ortográficos',
        ],
        examples: [
          'B vs V: Bello (bonito) vs vello (pelo), cabe (encaja) vs cava (vino)',
          'Regla B: verbos en -aba, -íamos; "ir al Baño"',
          'Regla V: sustantivos terminados en -ive, -ivo, -ividad',
          'C: ante a, o, u → casa, poco, cuanto',
          'Z: ante a, o, u → taza, pozo, zumo',
          'S: entre vocales → casa (no cassa)',
          'G: ante a, o, u → gato, goma, gusto',
          'G: ante e, i → gesto, gitano (g suave)',
          'J: siempre sonido fuerte → jarro, jirafa',
          'H: siempre muda → historia, hoja',
          'Palabras sin H: almohada (no alhomada)',
          'LL: sonido palatal → llama, llover',
          'Y: consonante y vocal → yo, yema; ayuda, raya',
          'Homófonas: Baya (fruta) vs vaya (ir) vs balla (danza medieval)',
          'Parónimas: Acción (hecho) vs acción (valor mobiliario), afección vs infección',
        ],
      },
      {
        name: 'Signos de Puntuación Avanzado',
        description:
          'Uso exhaustivo y correcto de comas, puntos, guiones y otros signos.',
        subtopics: [
          'Punto (. período, punto y seguido)',
          'Coma (, ) en oraciones complejas',
          'Punto y coma (;) para separaciones',
          'Dos puntos (:) para enumeraciones',
          'Puntos suspensivos (...)',
          'Signos de exclamación (!)',
          'Signos de interrogación (?)',
          'Paréntesis, corchetes y llaves',
          'Guión, raya y diálogo',
          'Comillas y su uso correcto',
        ],
        examples: [
          'Punto: "María estudia. Juan trabaja." (separa oraciones independientes)',
          'Punto y seguido: "María estudia. Ella es inteligente." (mismo tema)',
          'Punto y aparte: (fin de párrafo)',
          'Oración compuesta: "María llegó; Juan se fue; Pedro se quedó."',
          'Coma enumerativa: "Necesito: lápiz, papel, goma y regla."',
          'Dos puntos antes de lista: "Ingredientes: harina, huevo, sal"',
          'Pausa media: "Aunque llueva, iremos al parque."',
          'Coma apositiva: "Mi hermano, el ingeniero, llegó ayer."',
          'Puntos suspensivos: "No sé qué decir... es extraño..."',
          'Signos de apertura y cierre: "¿Cuándo llegaste?" "¡Qué sorpresa!"',
          'Paréntesis aclarador: "García (de origen español) fue importante."',
          'Raya para diálogo: —Hola, ¿cómo estás? —Bien, gracias.',
        ],
      },
      {
        name: 'Acentuación y Tildación',
        description:
          'Reglas completas de acento ortográfico y tildación en español.',
        subtopics: [
          'Palabras agudas, graves, esdrújulas, sobresdrújulas',
          'Reglas de acentuación para cada tipo',
          'Tilde diacrítica (para diferenciar palabras)',
          'Acentuación de diptongos y triptongos',
          'Hiatos vs diptongos',
          'Acentos en mayúsculas',
          'Acentuación de palabras compuestas',
          'Acentuación de formas verbales',
          'Palabras de acentuación dudosa',
          'Cambios recientes en las normas de acentuación',
        ],
        examples: [
          'Aguda (acento última sílaba): café, pintor, virtud (acentúa si termina en n, s, vocal)',
          'Grave (acento penúltimo): casa, árbol, claro (acentúa si no termina en n, s, vocal)',
          'Esdrújula (acento antepenúltimo): rápido, mágico, sábana (SIEMPRE tilde)',
          'Sobresdrújula (aún más atrás): Cómprale, explícamelo',
          'Diptongo: suave (no se divide)',
          'Hiato: caída (se divide: ca-í-da)',
          'Tilde diacrítica: té (bebida) vs te (pronombre)',
          'Más (preposición) vs más (adverbio de cantidad)',
          'Sé (verbo saber) vs se (pronombre)',
          'Mí (pronombre) vs mi (adjetivo)',
          'Tú (pronombre) vs tu (adjetivo)',
          'Él (pronombre) vs el (artículo)',
          'Cómo (pregunta/interrogativo) vs como (preposición/conjunción)',
          'Dónde (pregunta) vs donde (relativo)',
          'Cuándo (pregunta) vs cuando (conjunción)',
        ],
      },
      {
        name: 'Escritura de Números y Símbolos',
        description: 'Normas para escribir números, símbolos y abreviaturas.',
        subtopics: [
          'Números cardinales',
          'Números ordinales',
          'Números romanos',
          'Escritura de cantidades',
          'Dígitos vs palabras',
          'Decimales y porcentajes',
          'Símbolos matemáticos',
          'Unidades de medida',
          'Fechas y horas',
          'Abreviaturas comunes',
        ],
        examples: [
          'Cardinales: uno, dos, tres, veinti-, treinta, cuarenta',
          'Ordinales: primero, segundo, tercero, cuarto, quinto',
          'Romanos: I, II, III, IV, V, X, L, C, D, M',
          'Cantidad: "cinco dólares" o "5 dólares"',
          'Decimales: 3, 14 (español) vs 3.14 (inglés)',
          'Porcentaje: 25%, cincuenta por ciento',
          'Fecha: 10 de diciembre de 2025',
          'Hora: 14:30 (2:30 p.m.)',
          'Abreviaturas: Sr. (señor), Dra. (doctora), etc. (etcétera)',
          'Símbolos: @ (arroba), # (almohadilla), € (euro)',
        ],
      },
      {
        name: 'Errores Comunes y Correcciones',
        description:
          'Identificación y corrección de faltas ortográficas frecuentes.',
        subtopics: [
          'Palabras mal tildadas',
          'Confusión de palabras homofonas',
          'Errores en verbos irregulares',
          'Mayúsculas innecesarias',
          'Uso incorrecto de puntuación',
          'Espacios en blanco',
          'Apostrofos incorrectos',
          'Barras y guiones mal colocados',
          'Palabras portmanteau mal escritas',
          'Cambios dialectales',
        ],
        examples: [
          'Mal: "haya vs alla" | Correcto: "haya (árbol) vs allá (adverbio de lugar)"',
          'Mal: "a favor vs afavor" | Correcto: "a favor (locución)"',
          'Mal: "ah vs a vs ha" | Correcto: distinción clara',
          'Mal: "sino vs si no" | Correcto: "sino (conjunción) vs si no (condicional)"',
          'Mal: "y vs e (antes de i)" | Correcto: "X e Y, pero "María y Iñigo"',
          'Mal: "bacilo vs basilico" | Correcto: distinción de significado',
          'Mal: "suscinto vs sucinto" | Correcto: sucinto (breve)',
          'Mal: "greña vs greña" | Correcto: greña (cabello desordenado)',
        ],
      },
    ],
    keyFormulas: [
      'Aguda: acento en última sílaba (regla: n, s, vocal)',
      'Grave: acento en penúltima sílaba (regla: no n, no s, no vocal)',
      'Esdrújula: acento SIEMPRE en antepenúltima sílaba',
      'Tilde diacrítica: distingue significados (té vs te)',
      'Coma enumerativa: separa elementos de una lista',
      'Punto y coma: pausa mayor que coma, menor que punto',
    ],
    practiceExercises: [
      'Corregir palabras mal escritas: haya vs alla, a favor vs afavor',
      'Colocar puntuación correcta a párrafos complejos',
      'Colocar tildes en palabras sin acento ortográfico',
      'Clasificar palabras por su acentuación (aguda, grave, esdrújula)',
      'Distinguir entre palabras homofonas: vaya-baya-valla',
      'Identificar errores de mayúsculas/minúsculas',
      'Usar correctamente signos de puntuación en textos',
      'Diferenciar diptongos de hiatos',
      'Aplicar reglas de tilde diacrítica',
      'Corregir oraciones con puntuación incorrecta',
      'Escribir números en letras o cifras según contexto',
      'Identificar y corregir acentuación en verbos',
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
            <span className="rounded-full bg-green-500/30 px-4 py-1 text-sm">
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
            Reglas Fundamentales
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
