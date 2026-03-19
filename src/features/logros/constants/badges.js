// Este archivo ahora está factorizado en múltiples módulos
// para mantener una estructura organizada y fácil de mantener

export { LOGROS_DISPONIBLES, BADGE_CATEGORIES } from './index';

// Re-export by category for direct imports if needed
export {
  FIRST_STEPS_BADGES,
  STREAK_BADGES,
  ACADEMIC_BADGES,
  EXCELLENCE_BADGES,
  PLAN_BADGES,
  COLLABORATION_BADGES,
  CHALLENGE_BADGES,
  IMPROVEMENT_BADGES,
  KNOWLEDGE_BADGES,
  MILESTONE_BADGES,
  GAMIFICATION_BADGES,
  RIGOR_BADGES,
  STRATEGY_BADGES,
} from './badgesByCategory';

export { BADGE_CATEGORIES_CONFIG } from './categoriesConfig';
