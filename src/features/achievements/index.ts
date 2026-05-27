/**
 * Public exports for achievements / gamification UI.
 */
export { UnifiedAchievementsPage as default, UnifiedAchievementsPage, DailyChallengesWidget, DailyChallengesPage } from './pages';
export { UnifiedAchievementsHub } from './components';
export { useGamification, useLeaderboard, type LeaderboardPlayer } from '@/hooks/gamification';
export { useDailyChallenges, type DailyChallenge } from './hooks/useDailyChallenges';
export { ACHIEVEMENTS_DATA, ACHIEVEMENT_CATEGORIES } from './constants/achievements';
export { RANKS, getRankInfo } from '@/shared/constants/ranks';
