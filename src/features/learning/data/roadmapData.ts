export const SUBJECTS = [
  {
    id: 'matematicas',
    name: 'Matemáticas',
    icon: 'chart-line',
    color: 'text-green-400',
    bgColor: 'bg-green-600/20',
    borderColor: 'border-green-600',
    shortColor: 'from-green-600 to-green-400',
  },
  {
    id: 'lectura-critica',
    name: 'Lectura Crítica',
    icon: 'book',
    color: 'text-blue-400',
    bgColor: 'bg-blue-600/20',
    borderColor: 'border-blue-600',
    shortColor: 'from-blue-600 to-blue-400',
  },
  {
    id: 'ciencias-naturales',
    name: 'Ciencias Naturales',
    icon: 'bolt',
    color: 'text-purple-400',
    bgColor: 'bg-purple-600/20',
    borderColor: 'border-purple-600',
    shortColor: 'from-purple-600 to-purple-400',
  },
  {
    id: 'sociales',
    name: 'Sociales y Ciudadanas',
    icon: 'bullseye',
    color: 'text-orange-400',
    bgColor: 'bg-orange-600/20',
    borderColor: 'border-orange-600',
    shortColor: 'from-orange-600 to-orange-400',
  },
  {
    id: 'ingles',
    name: 'Inglés',
    icon: 'book',
    color: 'text-red-400',
    bgColor: 'bg-red-600/20',
    borderColor: 'border-red-600',
    shortColor: 'from-red-600 to-red-400',
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
    topics: [
      'Argumentos complejos',
      'Análisis crítico',
      'Inferencias avanzadas',
    ],
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
