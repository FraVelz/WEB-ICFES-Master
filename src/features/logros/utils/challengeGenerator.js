const CHALLENGE_TEMPLATES = [
  {
    type: 'math',
    title: 'Mente Matemática',
    description: 'Completa 3 ejercicios de Álgebra o Cálculo.',
    icon: 'calculator',
    area: 'matematicas',
    xpReward: 100,
    coinsReward: 20,
    target: 3
  },
  {
    type: 'reading',
    title: 'Lector Voraz',
    description: 'Lee y responde correctamente 2 textos de Lectura Crítica.',
    icon: 'book',
    area: 'lectura-critica',
    xpReward: 80,
    coinsReward: 15,
    target: 2
  },
  {
    type: 'science',
    title: 'Científico Loco',
    description: 'Responde 5 preguntas de Biología o Química.',
    icon: 'flask',
    area: 'ciencias-naturales',
    xpReward: 120,
    coinsReward: 25,
    target: 5
  },
  {
    type: 'social',
    title: 'Ciudadano Ejemplar',
    description: 'Completa una lección de Sociales y Ciudadanas.',
    icon: 'globe',
    area: 'sociales',
    xpReward: 90,
    coinsReward: 15,
    target: 1
  },
  {
    type: 'quick',
    title: 'Rayo Veloz',
    description: 'Responde 10 preguntas en menos de 5 minutos.',
    icon: 'bolt',
    area: 'general',
    xpReward: 150,
    coinsReward: 30,
    target: 10
  },
  {
    type: 'streak',
    title: 'Imparable',
    description: 'Mantén una racha de 5 respuestas correctas seguidas.',
    icon: 'brain',
    area: 'general',
    xpReward: 200,
    coinsReward: 50,
    target: 5
  }
];

export const generateDailyChallenges = () => {
  // Seleccionar 3 desafíos aleatorios para el día
  const shuffled = [...CHALLENGE_TEMPLATES].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3);

  return selected.map((template, index) => ({
    id: `daily-${Date.now()}-${index}`,
    ...template,
    status: 'pending', // pending, in_progress, completed
    progress: 0,
    createdAt: new Date().toISOString()
  }));
};
