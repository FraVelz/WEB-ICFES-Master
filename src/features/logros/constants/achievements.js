export const ACHIEVEMENTS_DATA = [
  {
    id: 'study_1',
    category: 'estudio',
    title: 'Primeros Pasos',
    description: 'Completa tus primeras 5 lecciones',
    icon: 'book',
    target: 5,
    xpReward: 100,
    coinsReward: 50
  },
  {
    id: 'study_2',
    category: 'estudio',
    title: 'Estudiante Dedicado',
    description: 'Completa 20 lecciones',
    icon: 'graduation-cap',
    target: 20,
    xpReward: 500,
    coinsReward: 200
  },
  {
    id: 'perf_1',
    category: 'rendimiento',
    title: 'Mente Brillante',
    description: 'Obtén 100% en un examen',
    icon: 'brain',
    target: 1,
    xpReward: 300,
    coinsReward: 150
  },
  {
    id: 'const_1',
    category: 'constancia',
    title: 'Racha de Fuego',
    description: 'Mantén una racha de 7 días',
    icon: 'fire',
    target: 7,
    xpReward: 200,
    coinsReward: 100
  },
  {
    id: 'meta_1',
    category: 'metas',
    title: 'Leyenda del ICFES',
    description: 'Alcanza el nivel 10',
    icon: 'trophy',
    target: 10,
    xpReward: 1000,
    coinsReward: 500
  },
  {
    id: 'time_1',
    category: 'constancia',
    title: 'Maratón de Estudio',
    description: 'Estudia durante 2 horas seguidas',
    icon: 'clock',
    target: 120, // minutos
    xpReward: 150,
    coinsReward: 75
  }
];

export const ACHIEVEMENT_CATEGORIES = {
  all: { label: 'Todos', icon: 'star' },
  estudio: { label: 'Estudio', icon: 'book' },
  rendimiento: { label: 'Rendimiento', icon: 'bolt' },
  constancia: { label: 'Constancia', icon: 'fire' },
  metas: { label: 'Metas', icon: 'trophy' }
};
