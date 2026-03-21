/**
 * Utilidades de gamificación (niveles, badges, XP)
 */

export const BADGES = {
  FIRST_QUESTION: {
    id: 'first_question',
    name: 'Primera Pregunta',
    description: 'Responde tu primera pregunta',
    icon: '🚀',
  },
  STREAK_7: {
    id: 'streak_7',
    name: 'En Racha',
    description: 'Mantén una racha de 7 días',
    icon: '🔥',
  },
  HUNDRED_QUESTIONS: {
    id: 'hundred_questions',
    name: 'Centenario',
    description: 'Responde 100 preguntas',
    icon: '💯',
  },
  NINETY_PERCENT: {
    id: 'ninety_percent',
    name: 'Genio',
    description: 'Alcanza 90% de precisión',
    icon: '🧠',
  },
  PERFECT_EXAM: {
    id: 'perfect_exam',
    name: 'Perfecto',
    description: 'Completa un examen con 100%',
    icon: '⭐',
  },
  AREA_MASTER_MATH: {
    id: 'area_master_math',
    name: 'Maestro de Matemáticas',
    description: '80% en Matemáticas',
    icon: '📐',
  },
  AREA_MASTER_LANGUAGE: {
    id: 'area_master_language',
    name: 'Maestro de Lenguaje',
    description: '80% en Lectura Crítica',
    icon: '📚',
  },
  AREA_MASTER_SCIENCE: {
    id: 'area_master_science',
    name: 'Maestro de Ciencias',
    description: '80% en Ciencias Naturales',
    icon: '🔬',
  },
  NIGHT_OWL: {
    id: 'night_owl',
    name: 'Búho Nocturno',
    description: 'Estudia después de las 11 PM',
    icon: '🦉',
  },
};

export const LEVELS = [
  {
    level: 1,
    name: 'Aprendiz',
    icon: '📚',
    minXP: 0,
    maxXP: 1000,
    color: 'from-blue-400 to-blue-600',
  },
  {
    level: 2,
    name: 'Estudiante',
    icon: '📖',
    minXP: 1000,
    maxXP: 3000,
    color: 'from-cyan-400 to-cyan-600',
  },
  {
    level: 3,
    name: 'Profesional',
    icon: '💼',
    minXP: 3000,
    maxXP: 6000,
    color: 'from-green-400 to-green-600',
  },
  {
    level: 4,
    name: 'Experto',
    icon: '🎓',
    minXP: 6000,
    maxXP: 10000,
    color: 'from-purple-400 to-purple-600',
  },
  {
    level: 5,
    name: 'Maestro',
    icon: '👑',
    minXP: 10000,
    maxXP: null,
    color: 'from-yellow-400 to-yellow-600',
  },
];

export const calculateLevel = (totalXP: number) => {
  let level = 1;
  for (const lvl of LEVELS) {
    if (totalXP >= lvl.minXP) level = lvl.level;
    else break;
  }
  return level;
};

export const getLevelInfo = (totalXP: number) => {
  const level = calculateLevel(totalXP);
  const levelData = LEVELS.find((l) => l.level === level) || LEVELS[0];
  const nextLevelData = LEVELS.find((l) => l.level === level + 1);
  const xpForNextLevel = nextLevelData ? nextLevelData.minXP - totalXP : null;
  const xpInCurrentLevel = totalXP - levelData.minXP;
  const xpNeededForNext = nextLevelData
    ? nextLevelData.minXP - levelData.minXP
    : null;
  const progress =
    nextLevelData && xpNeededForNext != null && xpNeededForNext > 0
      ? (xpInCurrentLevel / xpNeededForNext) * 100
      : 100;
  return {
    level,
    levelData,
    nextLevelData,
    xpForNextLevel,
    xpInCurrentLevel,
    xpNeededForNext,
    progress: Math.min(100, Math.max(0, progress)),
  };
};
