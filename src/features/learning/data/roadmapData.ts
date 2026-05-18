export const SUBJECTS = [
  {
    id: 'matematicas',
    name: 'Matemáticas',
    icon: 'chart-line',
    color: 'text-subject-math',
    bgColor: 'bg-subject-math-bold/20',
    borderColor: 'border-subject-math-bold',
    shortColor: 'from-subject-math-grad-from to-subject-math-grad-to',
  },
  {
    id: 'lectura-critica',
    name: 'Lectura Crítica',
    icon: 'book',
    color: 'text-subject-lc',
    bgColor: 'bg-subject-lc-bold/20',
    borderColor: 'border-subject-lc-bold',
    shortColor: 'from-subject-lc-grad-from to-subject-lc-grad-to',
  },
  {
    id: 'ciencias-naturales',
    name: 'Ciencias Naturales',
    icon: 'bolt',
    color: 'text-subject-sci',
    bgColor: 'bg-subject-sci-bold/20',
    borderColor: 'border-subject-sci-bold',
    shortColor: 'from-subject-sci-grad-from to-subject-sci-grad-to',
  },
  {
    id: 'sociales',
    name: 'Sociales y Ciudadanas',
    icon: 'bullseye',
    color: 'text-subject-soc',
    bgColor: 'bg-subject-soc-bold/20',
    borderColor: 'border-subject-soc-bold',
    shortColor: 'from-subject-soc-grad-from to-subject-soc-grad-to',
  },
  {
    id: 'ingles',
    name: 'Inglés',
    icon: 'book',
    color: 'text-subject-eng',
    bgColor: 'bg-subject-eng-bold/20',
    borderColor: 'border-subject-eng-bold',
    shortColor: 'from-subject-eng-to to-subject-eng-from',
  },
];

export const BASICO_TOPICS = {
  matematicas: [
    {
      title: 'Números Naturales',
      duration: '2h',
      content: 'Conceptos fundamentales',
    },
    {
      title: 'Operaciones Básicas',
      duration: '2h',
      content: 'Suma, resta, multiplicación, división',
    },
    {
      title: 'Fracciones y Decimales',
      duration: '2h',
      content: 'Operaciones con fracciones',
    },
    {
      title: 'Ecuaciones Lineales Básicas',
      duration: '2h',
      content: 'Introducción al álgebra',
    },
  ],
  'lectura-critica': [
    {
      title: 'Vocabulario Esencial',
      duration: '2h',
      content: 'Palabras clave del ICFES',
    },
    {
      title: 'Comprensión Literal',
      duration: '2h',
      content: 'Entender lo que se lee',
    },
    {
      title: 'Inferencias Simples',
      duration: '2h',
      content: 'Deducir información implícita',
    },
    {
      title: 'Estructura de Textos',
      duration: '2h',
      content: 'Identificar tipos de textos',
    },
  ],
  'ciencias-naturales': [
    {
      title: 'Método Científico',
      duration: '2h',
      content: 'Pasos del método científico',
    },
    {
      title: 'Magnitudes y Unidades',
      duration: '2h',
      content: 'Sistema de medida',
    },
    {
      title: 'Conceptos de Física Básica',
      duration: '2h',
      content: 'Movimiento y fuerzas',
    },
    {
      title: 'Tabla Periódica Fundamental',
      duration: '2h',
      content: 'Elementos químicos básicos',
    },
  ],
  sociales: [
    {
      title: 'Geografía Física Básica',
      duration: '2h',
      content: 'Regiones de Colombia',
    },
    {
      title: 'Conceptos Políticos Fundamentales',
      duration: '2h',
      content: 'Formas de gobierno',
    },
    {
      title: 'Historia Colombiana Esencial',
      duration: '2h',
      content: 'Hechos históricos clave',
    },
    {
      title: 'Derechos y Deberes Básicos',
      duration: '2h',
      content: 'Constitución básica',
    },
  ],
  ingles: [
    {
      title: 'Gramática Básica',
      duration: '2h',
      content: 'Estructura de oraciones',
    },
    {
      title: 'Vocabulario Cotidiano',
      duration: '2h',
      content: 'Palabras de uso diario',
    },
    {
      title: 'Comprensión de Audios Simples',
      duration: '2h',
      content: 'Listening básico',
    },
    {
      title: 'Lectura de Textos Simples',
      duration: '2h',
      content: 'Reading comprehension',
    },
  ],
};

export const INTERMEDIO_TOPICS = {
  matematicas: {
    title: 'Examen Matemáticas - Nivel Intermedio',
    description: 'Prueba tu dominio de álgebra y geometría',
    topics: ['Sistemas de ecuaciones', 'Funciones', 'Geometría analítica'],
    questions: 24,
    duration: '1h 20m',
    difficulty: 'Intermedio',
  },
  'lectura-critica': {
    title: 'Examen Lectura Crítica - Nivel Intermedio',
    description: 'Demuestra tu análisis de textos',
    topics: ['Argumentos complejos', 'Análisis crítico', 'Inferencias avanzadas'],
    questions: 25,
    duration: '1h 15m',
    difficulty: 'Intermedio',
  },
  'ciencias-naturales': {
    title: 'Examen Ciencias Naturales - Nivel Intermedio',
    description: 'Prueba integrada de Física, Química y Biología',
    topics: ['Física aplicada', 'Química orgánica', 'Biología celular'],
    questions: 24,
    duration: '1h 20m',
    difficulty: 'Intermedio',
  },
  sociales: {
    title: 'Examen Sociales - Nivel Intermedio',
    description: 'Análisis de contextos históricos y políticos',
    topics: ['Historia mundial', 'Geografía política', 'Ciudadanía activa'],
    questions: 25,
    duration: '1h 15m',
    difficulty: 'Intermedio',
  },
  ingles: {
    title: 'Examen Inglés - Nivel Intermedio',
    description: 'Evaluate your intermediate English skills',
    topics: ['Conversación contextual', 'Redacción simple', 'Comprensión'],
    questions: 25,
    duration: '1h 15m',
    difficulty: 'Intermedio',
  },
};
