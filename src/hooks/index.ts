/**
 * App-wide custom hooks barrel (GSAP utilities + optional re-exports).
 *
 * Prefer direct imports from the owning feature when possible:
 *   import { useProgress } from '@/features/user/hooks/useProgress';
 */

export { useUser } from '@/features/user/hooks/useUser';
export { useUserData } from '@/features/user/hooks/useUserData';
export { useProgress } from '@/features/user/hooks/useProgress';
export { useGamification, useLeaderboard, type LeaderboardPlayer } from '@/hooks/gamification';
export { useExam } from '@/features/exam/hooks/useExam';
