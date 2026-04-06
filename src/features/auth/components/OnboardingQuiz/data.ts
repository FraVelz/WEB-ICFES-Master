// Intro screens (onboarding)
export const INTRODUCTION_SECTIONS = [
  {
    id: 1,
    message: '¡Hola!, Yo soy Zeus.',
    avatar: '/avatars/logo.webp', // Hero image
    description: 'Tu asistente de estudio',
  },
  {
    id: 2,
    message: '¡Responde 5 preguntas cortas antes de comenzar!',
    avatar: '/avatars/logo.webp', // Second intro image
    description: 'Personalizaremos tu experiencia.',
  },
];

// Onboarding quiz questions
export const ONBOARDING_QUESTIONS = [
  {
    id: 1,
    question: '¿Cuál es tu objetivo principal?',
    type: 'single',
    options: [
      { value: 'pass', label: 'Pasar el ICFES' },
      { value: 'excel', label: 'Obtener un puntaje excelente' },
      { value: 'prepare', label: 'Prepararme a mi propio ritmo' },
      { value: 'improve', label: 'Mejorar mis debilidades' },
    ],
  },
  {
    id: 2,
    question: '¿En cuánto tiempo planeas presentar el ICFES?',
    type: 'single',
    options: [
      { value: 'less_month', label: 'Menos de 1 mes' },
      { value: '1_3_months', label: '1 a 3 meses' },
      { value: '3_6_months', label: '3 a 6 meses' },
      { value: 'more_6_months', label: 'Más de 6 meses' },
    ],
  },
  {
    id: 3,
    question: '¿Cuál es tu nivel actual?',
    type: 'single',
    options: [
      { value: 'beginner', label: 'Principiante (nunca he practicado)' },
      {
        value: 'intermediate',
        label: 'Intermedio (tengo algo de experiencia)',
      },
      { value: 'advanced', label: 'Avanzado (ya he practicado bastante)' },
    ],
  },
  {
    id: 4,
    question: '¿Cuáles son tus áreas débiles? (selecciona 1 o más)',
    type: 'multiple',
    options: [
      { value: 'math', label: 'Matemáticas' },
      { value: 'language', label: 'Lenguaje' },
      { value: 'science', label: 'Ciencias Naturales' },
      { value: 'social', label: 'Ciencias Sociales' },
      { value: 'english', label: 'Inglés' },
      { value: 'none', label: 'Me desempeño bien en todo' },
    ],
  },
  {
    id: 5,
    question: '¿Cuánto tiempo disponible tienes para estudiar diariamente?',
    type: 'single',
    options: [
      { value: 'less_30m', label: 'Menos de 30 minutos' },
      { value: '30m_1h', label: '30 minutos a 1 hora' },
      { value: '1h_2h', label: '1 a 2 horas' },
      { value: 'more_2h', label: 'Más de 2 horas' },
    ],
  },
];
