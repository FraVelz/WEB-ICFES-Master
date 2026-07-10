/**
 * Utilidades de gamificación (niveles y XP)
 */

const LEVELS = [
  {
    level: 1,
    name: 'Aprendiz',
    icon: 'book-open',
    minXP: 0,
    maxXP: 1000,
    color: 'from-blue-400 to-blue-600',
  },
  {
    level: 2,
    name: 'Estudiante',
    icon: 'book',
    minXP: 1000,
    maxXP: 3000,
    color: 'from-app-accent to-app-accent-strong',
  },
  {
    level: 3,
    name: 'Profesional',
    icon: 'award',
    minXP: 3000,
    maxXP: 6000,
    color: 'from-green-400 to-green-600',
  },
  {
    level: 4,
    name: 'Experto',
    icon: 'graduation-cap',
    minXP: 6000,
    maxXP: 10000,
    color: 'from-purple-400 to-purple-600',
  },
  {
    level: 5,
    name: 'Maestro',
    icon: 'crown',
    minXP: 10000,
    maxXP: null,
    color: 'from-yellow-400 to-yellow-600',
  },
] as const;

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
  const xpNeededForNext = nextLevelData ? nextLevelData.minXP - levelData.minXP : null;
  const progress =
    nextLevelData && xpNeededForNext != null && xpNeededForNext > 0 ? (xpInCurrentLevel / xpNeededForNext) * 100 : 100;
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
