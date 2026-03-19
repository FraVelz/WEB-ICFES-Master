import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';

export const Gramatica = () => {
  const content = {
    title: 'Gramática Española', duration: '8-9 horas', lessons: 28, difficulty: 'medio', topics: [
      {
        name: 'Verbos: Conjugación y Uso', description: 'Estudio exhaustivo de clasificación, conjugación y usos avanzados de verbos en español.', subtopics: [
          'Verbos regulares e irregulares', 'Tiempos verbales (presente, pasado, futuro)', 'Modos (indicativo, subjuntivo, imperativo, condicional)', 'Verbos reflexivos y recíprocos', 'Verbos pronominales', 'Conjugación perifrástica (ir a + infinitivo)', 'Voz pasiva y activa', 'Participios y gerundios', 'Tiempos perfectos (compuestos)', 'Aspecto perfecto e imperfecto'
        ], examples: [
          'Regular: Hablar: hablo, hablas, habla, hablamos, habláis, hablan', 'Irregular: Ser: soy, eres, es, somos, sois, son', 'Ir: voy, vas, va, vamos, vais, van', 'Estar: estoy, estás, está, estamos, estáis, están', 'Tener: tengo, tienes, tiene, tenemos, tenéis, tienen', 'Verbos reflexivos: lavarse, levantarse, acostarse', 'Perifrástica: "Voy a estudiar" (futuro próximo)', 'Pasiva: "El libro fue escrito por María"', 'Activa: "María escribió el libro"', 'Gerundio: "Estudiando aprenderás" (participio presente)'
        ]
      }, {
        name: 'Sustantivos y Adjetivos', description: 'Análisis profundo de clasificación, género, número y concordancia.', subtopics: [
          'Género (masculino, femenino, neutro)', 'Número (singular, plural)', 'Adjetivos calificativos', 'Adjetivos determinativos (demostrativos, posesivos, indefinidos)', 'Adjetivos comparativos y superlativos', 'Concordancia de género y número', 'Sustantivos contables e incontables', 'Sustantivos propios y comunes', 'Sustantivos colectivos', 'Apócope de adjetivos'
        ], examples: [
          'El gato negro - La casa grande', 'Plural: niño→niños, casa→casas, luz→luces, actor→actores', 'Concordancia: mujer inteligente, hombres inteligentes', 'Demostrativo: este, ese, aquel', 'Posesivo: mi, tu, su, nuestro, vuestro', 'Indefinido: algún, ningún, todo, otro', 'Comparativo: más grande que, menos bonito que', 'Superlativo: el más grande, bellísimo', 'Apócope: "un" (antes de sustantivo masculino), "buen" (antes de sustantivo)'
        ]
      }, {
        name: 'Conjugaciones Verbales Detalladas', description: 'Patrones completos de conjugación en los tres grupos y formas irregulares.', subtopics: [
          'Primera conjugación (-ar): amar, hablar, comprar', 'Segunda conjugación (-er): comer, beber, temer', 'Tercera conjugación (-ir): vivir, partir, recibir', 'Tiempos simples: presente, pretérito, futuro, condicional', 'Tiempos compuestos: perfectos, pluscuamperfecto', 'Presente: radical + terminación', 'Pretérito imperfecto', 'Pretérito indefinido (perfecto simple)', 'Conjugación subjuntiva', 'Formas no personales: infinitivo, gerundio, participio'
        ], examples: [
          'Presente: Yo hablo, tú hablas, él habla, nosotros hablamos, vosotros habláis, ellos hablan', 'Pretérito indefinido: Hablé, hablaste, habló, hablamos, hablasteis, hablaron', 'Pretérito imperfecto: Hablaba, hablabas, hablaba, hablábamos, hablabais, hablaban', 'Futuro: Hablaré, hablarás, hablará, hablaremos, hablaréis, hablarán', 'Condicional: Hablaría, hablarías, hablaría, hablaríamos, hablaríais, hablarían', 'Presente subjuntivo: Hable, hables, hable, hablemos, habléis, hablen', 'Imperativo: habla, hable, hablemos, hablad, hablen'
        ]
      }, {
        name: 'Pronombres y Relaciones Pronominales', description: 'Análisis de tipos de pronombres y su correcto uso en construcciones sintácticas.', subtopics: [
          'Pronombres personales: sujeto, objeto directo, indirecto', 'Pronombres reflexivos', 'Pronombres relativos (que, quien, cual, cuyo)', 'Pronombres demostrativos', 'Pronombres posesivos', 'Pronombres indefinidos', 'Pronombres interrogativos', 'Pronombres enclíticos y proclíticos', 'Orden de pronombres átonos', 'Leísmo, loísmo, laísmo'
        ], examples: [
          'Sujeto: Yo, tú, él, nosotros, vosotros, ellos', 'Objeto directo: me, te, lo, la, nos, os, los, las', 'Objeto indirecto: me, te, le, nos, os, les', 'Reflexivos: me, te, se, nos, os', 'Relativos: El libro que leí, la persona quien vino', 'Orden correcto: Se lo dije (no Se dije lo)', 'Enclíticos: Dímelo, hazlo, cómpralo', 'Proclíticos: Me lo diste, nos lo prometiste'
        ]
      }, {
        name: 'Oraciones Complejas y Análisis Sintáctico', description: 'Estudio de estructura oracional, coordinación y subordinación.', subtopics: [
          'Oraciones simples', 'Oraciones compuestas (coordinadas, subordinadas)', 'Coordinación por conjunciones: y, o, pero, sino', 'Subordinación: causal, temporal, condicional, final, concesiva', 'Cláusulas relativas', 'Análisis de sujeto y predicado', 'Complementos del verbo (directo, indirecto, circunstancial)', 'Concordancia sujeto-verbo', 'Ambigüedad sintáctica', 'Construcciones con infinitivo y gerundio'
        ], examples: [
          'Simple: "María estudia Ingeniería"', 'Coordinada: "María estudia y Juan trabaja"', 'Subordinada causal: "Llegó tarde porque se perdió"', 'Subordinada temporal: "Cuando termine, te llamo"', 'Subordinada condicional: "Si llueve, no iremos"', 'Relativa: "El estudiante que ganó es mi amigo"', 'Complemento directo: "Vi a María ayer"', 'Complemento indirecto: "Le dije la verdad"', 'Circunstancial de lugar: "Vivo en Madrid"'
        ]
      }
    ], keyFormulas: [
      'Presente regular: raíz + terminación presente', 'Pretérito: raíz + terminación especial (-é, -aste, -ó)', 'Futuro: infinitivo + terminación futura', 'Sustantivo + adjetivo = concordancia en género y número', 'Verbo + pronombre = colocación correcta del pronombre', 'Oración simple = sujeto + predicado', 'Oración compuesta = múltiples verbos conjugados'
    ], practiceExercises: [
      'Conjugar verbos regulares e irregulares en todos los tiempos', 'Hacer concordancia: El día (soleado/soleada/soleados)', 'Identificar y corregir errores de concordancia', 'Análisis sintáctico: sujeto, predicado y complementos', 'Transformar oraciones: activa a pasiva y viceversa', 'Conjugar "ser, estar, tener, haber" en todos los tiempos', 'Identificar verbos irregulares: ser, ir, estar, tener, haber, venir, salir', 'Colocar pronombres correctamente en oraciones', 'Crear oraciones complejas con coordinación y subordinación', 'Reconocer tipos de subordinadas por su función', 'Diferenciar entre gerundio, participio e infinitivo', 'Ejercicios de transformación: cambio de tiempo y modo'
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
            <Icon name="arrow-left" className="text-xl" />
            Volver
          </Link>
          <p className="text-sm text-gray-400">Lenguaje</p>
        </div>

        <header className="mb-16 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Icon name="book" className="text-5xl text-blue-400" />
            <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {content.title}
            </h1>
          </div>
          <div className="flex justify-center gap-8 text-gray-300 mb-8">
            <span className="flex items-center gap-2"><Icon name="clock" /> {content.duration}</span>
            <span className="flex items-center gap-2"><Icon name="book" /> {content.lessons} lecciones</span>
            <span className="px-4 py-1 rounded-full bg-green-500/30 text-sm">{content.difficulty}</span>
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
          <h2 className="text-3xl font-bold text-cyan-400 mb-8">Conceptos Clave</h2>
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
