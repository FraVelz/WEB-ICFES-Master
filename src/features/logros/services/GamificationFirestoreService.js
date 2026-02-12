/**
 * Servicio de gamificación - Versión local (localStorage)
 * Preparado para futura implementación de backend
 */
import { addVirtualMoney, removeVirtualMoney, getVirtualMoney } from '@/shared/utils/userProfile';

export const BADGES = {
  FIRST_QUESTION: { id: 'first_question', name: 'Primera Pregunta', description: 'Responde tu primera pregunta', icon: '🚀' },
  STREAK_7: { id: 'streak_7', name: 'En Racha', description: 'Mantén una racha de 7 días', icon: '🔥' },
  HUNDRED_QUESTIONS: { id: 'hundred_questions', name: 'Centenario', description: 'Responde 100 preguntas', icon: '💯' },
  NINETY_PERCENT: { id: 'ninety_percent', name: 'Genio', description: 'Alcanza 90% de precisión', icon: '🧠' },
  PERFECT_EXAM: { id: 'perfect_exam', name: 'Perfecto', description: 'Completa un examen con 100%', icon: '⭐' },
  AREA_MASTER_MATH: { id: 'area_master_math', name: 'Maestro de Matemáticas', description: '80% en Matemáticas', icon: '📐' },
  AREA_MASTER_LANGUAGE: { id: 'area_master_language', name: 'Maestro de Lenguaje', description: '80% en Lectura Crítica', icon: '📚' },
  AREA_MASTER_SCIENCE: { id: 'area_master_science', name: 'Maestro de Ciencias', description: '80% en Ciencias Naturales', icon: '🔬' },
  NIGHT_OWL: { id: 'night_owl', name: 'Búho Nocturno', description: 'Estudia después de las 11 PM', icon: '🦉' }
};

export const LEVELS = [
  { level: 1, name: 'Aprendiz', icon: '📚', minXP: 0, maxXP: 1000, color: 'from-blue-400 to-blue-600' },
  { level: 2, name: 'Estudiante', icon: '📖', minXP: 1000, maxXP: 3000, color: 'from-cyan-400 to-cyan-600' },
  { level: 3, name: 'Profesional', icon: '💼', minXP: 3000, maxXP: 6000, color: 'from-green-400 to-green-600' },
  { level: 4, name: 'Experto', icon: '🎓', minXP: 6000, maxXP: 10000, color: 'from-purple-400 to-purple-600' },
  { level: 5, name: 'Maestro', icon: '👑', minXP: 10000, maxXP: null, color: 'from-yellow-400 to-yellow-600' }
];

const GAMIFICATION_KEY = 'icfes_gamification';

export const calculateLevel = (totalXP) => {
  let level = 1;
  for (const lvl of LEVELS) {
    if (totalXP >= lvl.minXP) level = lvl.level;
    else break;
  }
  return level;
};

export const getLevelInfo = (totalXP) => {
  const level = calculateLevel(totalXP);
  const levelData = LEVELS.find(l => l.level === level) || LEVELS[0];
  const nextLevelData = LEVELS.find(l => l.level === level + 1);
  const xpForNextLevel = nextLevelData ? nextLevelData.minXP - totalXP : null;
  const xpInCurrentLevel = totalXP - levelData.minXP;
  const xpNeededForNext = nextLevelData ? nextLevelData.minXP - levelData.minXP : null;
  const progress = nextLevelData && xpNeededForNext > 0 ? (xpInCurrentLevel / xpNeededForNext) * 100 : 100;
  return {
    level,
    levelData,
    nextLevelData,
    xpForNextLevel,
    xpInCurrentLevel,
    xpNeededForNext,
    progress: Math.min(100, Math.max(0, progress))
  };
};

class GamificationFirestoreService {
  async createGamificationProfile(userId) {
    const defaultProfile = {
      userId,
      totalXP: 0,
      level: 1,
      virtualMoney: 0,
      achievements: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(GAMIFICATION_KEY, JSON.stringify(defaultProfile));
    return defaultProfile;
  }

  async getProfile(userId) {
    const stored = localStorage.getItem(GAMIFICATION_KEY);
    return stored ? JSON.parse(stored) : { totalXP: 0, level: 1, virtualMoney: 0, achievements: {} };
  }

  async addXP(userId, points, reason = 'activity') {
    const gam = JSON.parse(localStorage.getItem(GAMIFICATION_KEY) || '{}');
    const newXP = (gam.totalXP || 0) + points;
    const newLevel = calculateLevel(newXP);
    const updated = {
      ...gam,
      totalXP: newXP,
      level: newLevel,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(GAMIFICATION_KEY, JSON.stringify(updated));
    return { totalXP: newXP, level: newLevel };
  }

  async addCoins(userId, amount, reason = 'reward') {
    addVirtualMoney(amount);
    return { coins: getVirtualMoney(), virtualMoney: getVirtualMoney() };
  }

  async spendCoins(userId, amount, item = 'purchase') {
    removeVirtualMoney(amount);
    return { coins: getVirtualMoney(), virtualMoney: getVirtualMoney() };
  }
}

export default new GamificationFirestoreService();
