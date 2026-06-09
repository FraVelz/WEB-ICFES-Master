/**
 * Public exports for achievements / gamification UI.
 */
export { UnifiedAchievementsPage as default, UnifiedAchievementsPage } from './pages';
export { useGamification, useLeaderboard, type LeaderboardPlayer } from '@/hooks/gamification';
export { ACHIEVEMENTS_DATA, ACHIEVEMENT_CATEGORIES } from '@/shared/constants/achievementsData';
export { RANKS, getRankInfo } from '@/shared/constants/ranks';
