export { ACHIEVEMENTS_DATA, ACHIEVEMENT_CATEGORIES } from '@/shared/constants/achievementsData';
export type { AchievementCategoryKey } from '@/shared/constants/achievementsData';
export {
  normalizeAchievementsRecord,
  readAchievementProgress,
  resolveAchievementUserId,
  syncAchievementsFromGameplay,
  reconcileAchievementsWithoutRewards,
  mergeAchievementProgressMaps,
  type AchievementProgressEntry,
  type AchievementProgressMap,
} from './achievementProgressService';
