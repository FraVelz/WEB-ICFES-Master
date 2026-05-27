// This file is split across multiple modules
// to keep an organized, maintainable structure

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
