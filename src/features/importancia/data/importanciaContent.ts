export type ImportanciaSection = {
  id: string;
  title: string;
  icon: string;
  paragraphs: string[];
  bullets?: string[];
};

export type ImportanciaTrack = {
  id: 'saber-11' | 'validacion';
  title: string;
  subtitle: string;
  icon: string;
  sections: ImportanciaSection[];
};

export const IMPORTANCIA_INTRO =
  'Terminar el bachillerato y prepararte para el examen no es solo un trámite escolar: abre puertas reales en empleo, ingresos, estabilidad y proyectos de vida. Abajo encontrarás lo que aplica para todos y, en los menús desplegables, la información específica del Saber 11° o de la Prueba de Validación, según tu caso.';

/** Contenido visible para ambos caminos (fuera de los desplegables). */
export const IMPORTANCIA_GENERAL_SECTIONS: ImportanciaSection[] = [
  {
    id: 'brecha',
    title: 'La brecha salarial y de oportunidades',
    icon: 'chart-line',
    paragraphs: [
      'En Colombia la diferencia entre no tener bachiller, tenerlo o sumar estudios superiores se nota en ingresos, estabilidad y tipo de trabajo. Son cifras aproximadas y varían por ciudad, sector y experiencia, pero ilustran la tendencia:',
    ],
    bullets: [
      'Sin bachiller, muchas personas dependen del trabajo informal o de oficios sin contrato. Es común que los ingresos queden alrededor de 1 millón de pesos mensuales o menos, con poca estabilidad y difícil acceso a crédito o beneficios.',
      'Con bachiller acreditado, suele ser más fácil acceder a empleos formales: auxiliares, operarios calificados, atención al cliente, logística u oficios que piden diploma. Muchos arrancan cerca del salario mínimo o un poco más, pero con contrato, aportes y mayor previsibilidad.',
      'Con un buen puntaje y acceso a la universidad (o tecnología), se abren carreras profesionales. Un recién graduado con título puede empezar en roles junior formales, a menudo desde unos 2 salarios mínimos, y con experiencia en sectores demandantes escalar hacia ingresos de 10 millones de pesos mensuales o más en posiciones altamente cualificadas.',
    ],
  },
  {
    id: 'cambio',
    title: 'Un cambio de vida para muchas familias',
    icon: 'heart',
    paragraphs: [
      'Para quienes crecieron con limitaciones económicas o interrumpieron estudios, cerrar el bachiller y mejorar el puntaje puede significar dejar un empleo precario, mudarse a una ciudad con más oferta, pagar estudios de los hijos o acceder a vivienda y salud de forma más estable.',
      'No es magia ni ocurre de un día para otro: exige estudio, constancia y, a veces, combinar trabajo con preparación. Pero el salto entre informalidad, empleo formal y carrera profesional es uno de los cambios más grandes que una persona puede lograr con educación.',
    ],
  },
  {
    id: 'emprendimiento',
    title: 'Emprender y especializarse',
    icon: 'rocket',
    paragraphs: [
      'La educación no solo sirve para ser empleado. Si quieres montar un negocio propio, estudiar temas relacionados con lo que harás —contabilidad básica, marketing, diseño, programación, gastronomía, construcción, salud— te da herramientas para emprender en nichos técnicos o especializados con menos improvisación.',
      'El bachiller y la formación posterior te ayudan a entender normas, costos, calidad y a comunicarte con clientes, proveedores o inversionistas con más credibilidad.',
    ],
  },
  {
    id: 'arte',
    title: 'Arte, talento y otros caminos',
    icon: 'magic',
    paragraphs: [
      'Si te interesan el arte, la música, el deporte o cualquier área creativa, el estudio formal no reemplaza el talento, pero sí suma: mejor técnica, reconocimiento, redes de contacto, becas, portafolios más sólidos y opciones de enseñar o trabajar en proyectos culturales con respaldo académico.',
      'Muchas carreras artísticas y técnicas exigen bachiller para ingresar; el puntaje puede abrir programas, convenios o instituciones que de otra forma serían inalcanzables.',
    ],
  },
];

export const IMPORTANCIA_SABER_11_TRACK: ImportanciaTrack = {
  id: 'saber-11',
  title: 'Saber 11° (ICFES)',
  subtitle: 'Para estudiantes que terminan grado 11 y buscan ingresar a la universidad o programas con puntaje.',
  icon: 'graduation-cap',
  sections: [
    {
      id: 'saber-quien',
      title: '¿Para quién es?',
      icon: 'circle-user',
      paragraphs: [
        'El Saber 11° está pensado para jóvenes que culminan el grado 11 en colegio, institución o modalidad flexible, y que necesitan el puntaje para postularse a programas de educación superior, becas, créditos o convenios que exigen resultados del ICFES.',
        'Evalúa los mismos criterios y competencias del bachillerato que la Prueba de Validación: no es un examen distinto en contenido, sino el camino para quienes terminan el grado 11 en la ruta escolar tradicional.',
      ],
    },
    {
      id: 'saber-para-que',
      title: '¿Para qué sirve el puntaje?',
      icon: 'bullseye',
      paragraphs: [
        'Las universidades e institutos usan el puntaje global y por área para admisión, cupos especiales y becas. Un buen resultado amplía las opciones de carrera, ciudad e institución; un puntaje bajo puede limitar programas competitivos, aunque siempre hay rutas alternativas (tecnología, ciclos propedéuticos, etc.).',
      ],
      bullets: [
        'Admisión a pregrado en universidades públicas y privadas.',
        'Becas del Estado, entidades territoriales o convenios institucionales.',
        'Programas que exigen mínimos por área (p. ej. salud o ingeniería).',
      ],
    },
    {
      id: 'saber-areas',
      title: 'Áreas que presentas',
      icon: 'book-open',
      paragraphs: [
        'Presentas las cinco pruebas obligatorias del Saber 11° —las mismas áreas que la Prueba de Validación—. Cada una aporta al puntaje global y muchas instituciones revisan también el desempeño por materia.',
      ],
      bullets: [
        'Lectura crítica',
        'Matemáticas',
        'Ciencias naturales',
        'Sociales y ciudadanas',
        'Inglés',
      ],
    },
    {
      id: 'saber-preparacion',
      title: 'Cómo prepararte',
      icon: 'lightbulb',
      paragraphs: [
        'Combina repaso de tu grado 11, simulacros cronometrados y análisis de errores. Identifica áreas débiles con tiempo: suele ser más rentable subir matemáticas o lectura crítica que repasar todo por igual.',
        'En ICFES Master puedes practicar por área, hacer simulacros completos y seguir una ruta de aprendizaje según tu nivel.',
      ],
    },
  ],
};

export const IMPORTANCIA_VALIDACION_TRACK: ImportanciaTrack = {
  id: 'validacion',
  title: 'Prueba de Validación del bachillerato',
  subtitle: 'Para personas adultas que no terminaron el bachiller en la ruta tradicional y quieren acreditarlo.',
  icon: 'clipboard-list',
  sections: [
    {
      id: 'validacion-quien',
      title: '¿Para quién es?',
      icon: 'circle-user',
      paragraphs: [
        'La Prueba de Validación está dirigida a personas mayores de edad que, por trabajo, migración, embarazo, responsabilidades familiares u otras razones, no completaron el bachillerato en el colegio y necesitan el título para continuar estudios, ascender laboralmente o cumplir requisitos formales.',
        'Mide los mismos aprendizajes del bachillerato que el Saber 11°: mismas cinco áreas y mismo enfoque de evaluación. La diferencia está en quién la presenta y en que, al aprobar, acreditas el bachiller que no obtuviste en la ruta escolar tradicional.',
      ],
    },
    {
      id: 'validacion-para-que',
      title: '¿Qué obtienes al aprobar?',
      icon: 'check-circle',
      paragraphs: [
        'Al superar la validación obtienes la acreditación del bachillerato académico. Eso te habilita para inscribirte en educación superior, postular a empleos que piden diploma y acceder a trámites que antes te quedaban cerrados.',
        'Tu puntaje se reporta en la misma escala que el Saber 11°. Las universidades y entidades que piden puntaje ICFES reconocen un resultado sólido en validación como comparable al de un estudiante de grado 11.',
      ],
    },
    {
      id: 'validacion-areas',
      title: 'Áreas que presentas',
      icon: 'book-open',
      paragraphs: [
        'Las pruebas cubren los mismos aprendizajes y las mismas cinco áreas que el Saber 11°. No es un examen “más fácil”: exige dominar contenidos que muchas personas retoman después de años sin estudiar.',
      ],
      bullets: [
        'Lectura crítica',
        'Matemáticas',
        'Ciencias naturales',
        'Sociales y ciudadanas',
        'Inglés',
      ],
    },
    {
      id: 'validacion-ruta',
      title: 'Ruta típica de preparación',
      icon: 'map',
      paragraphs: [
        'Muchos adultos combinan estudio autónomo, cursos de validación en instituciones educativas y práctica con simulacros. Lo habitual es inscribirse en un programa de educación para adultos o validación, cumplir requisitos de la secretaría de educación y presentar la prueba en las fechas del calendario ICFES.',
        'Si trabajas a tiempo completo, planifica bloques cortos pero constantes: 30–45 minutos diarios suelen rendir más que estudiar solo los fines de semana.',
      ],
      bullets: [
        'Consulta requisitos e inscripción en tu secretaría de educación o centro de validación.',
        'Repasa por áreas empezando por lectura crítica y matemáticas.',
        'Usa simulacros para acostumbrarte al tiempo y al formato.',
      ],
    },
    {
      id: 'validacion-despues',
      title: 'Después de validar',
      icon: 'arrow-up',
      paragraphs: [
        'Con bachiller acreditado puedes postular a tecnología, universidad o empleos formales. Un puntaje alto en validación abre las mismas puertas académicas que un buen Saber 11°: no compites con un estándar distinto.',
        'Muchas personas usan la validación como primer paso y luego continúan a pregrado, emprendimiento especializado o formación técnica en el área que les interesa.',
      ],
    },
  ],
};

export const IMPORTANCIA_TRACKS: ImportanciaTrack[] = [
  IMPORTANCIA_SABER_11_TRACK,
  IMPORTANCIA_VALIDACION_TRACK,
];

export const IMPORTANCIA_CLOSING =
  'Prepararte con método —ya sea para el Saber 11° o para la Prueba de Validación— es invertir en opciones: más ingresos, más estabilidad, más libertad para elegir qué quieres hacer. ICFES Master está aquí para ayudarte en ese camino con práctica, simulacros y una ruta de aprendizaje guiada.';
