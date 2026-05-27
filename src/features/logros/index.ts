/**
 * Public exports for achievements / gamification (pages, components, hooks, services).
 */
export { UnifiedAchievementsPage as default, UnifiedAchievementsPage, DailyChallengesWidget, DailyChallengesPage } from './pages';
export { UnifiedAchievementsHub } from './components';
export { useGamification } from './hooks/useGamification';
export { useDailyChallenges, type DailyChallenge } from './hooks/useDailyChallenges';
export { ACHIEVEMENTS_DATA, ACHIEVEMENT_CATEGORIES } from './constants/achievements';
export { RANKS, getRankInfo } from './constants/ranks';
export { default as GamificationLocalService } from '@/services/gamification/GamificationLocalService';
