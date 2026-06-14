import { useAuth } from '@/features/auth/context/AuthContext';
import { useGamification, useGamificationContextOptional, useGamificationScope } from '@/hooks/gamification';
import { getLevelInfo } from '@/services/gamification/gamificationUtils';
import { RANKS } from '@/shared/constants/ranks';
import { isDemoUserId } from '@/services/demo/demoCoins';
import { useUserProfileData } from './useUserProfileData';
import { useUserProfileStudyTime } from './useUserProfileStudyTime';

const levelToRankId = (level: number): string => {
  const rankOrder = Math.min(Math.max(level, 1), 7);
  const rank = Object.values(RANKS).find((r) => r.order === rankOrder);
  return rank?.id ?? 'novato';
};

/**
 * Profile view — Supabase for real users, demo profile for demo scope.
 */
export const useUserProfile = (targetUserId: string | null = null) => {
  const { user: authUser, loading: authLoading } = useAuth();
  const ownGamificationScope = useGamificationScope();
  const uid = targetUserId || authUser?.uid;
  const { profileData, isOwnProfile } = useUserProfileData(uid);
  const streakScope = targetUserId ? (isDemoUserId(targetUserId) ? 'demo' : targetUserId) : ownGamificationScope;
  const gamificationContext = useGamificationContextOptional();
  const hookScope = targetUserId ? streakScope : gamificationContext ? undefined : ownGamificationScope;
  const hookGamification = useGamification(hookScope);
  const {
    loading: gamificationLoading,
    achievements,
    totalXP,
    level,
    completedCount,
    coins,
    streak,
    currentStreak,
    longestStreak,
    refreshData,
    isDemoScope,
  } = targetUserId ? hookGamification : (gamificationContext ?? hookGamification);

  const studyTimeMinutes = useUserProfileStudyTime(uid);

  const totalXPFromDB = typeof totalXP === 'number' ? totalXP : 0;
  const levelInfo = getLevelInfo(totalXPFromDB);
  const rank = levelToRankId(levelInfo.level);
  const loading = profileData.loading || (!uid && authLoading);

  return {
    uid,
    isOwnProfile,
    gamificationLoading,
    /** Nivel visual (por XP total); no confundir con liga competitiva — usar `useMyLeague`. */
    rank,
    levelRank: rank,
    ...profileData,
    achievements,
    totalXP: totalXPFromDB,
    level,
    completedCount,
    coins,
    streak,
    currentStreak,
    longestStreak,
    refreshData,
    isDemoScope,
    studyTimeMinutes,
    loading,
    levelInfo: {
      level: levelInfo.level,
      levelName: levelInfo.levelData.name,
      levelIcon: levelInfo.levelData.icon,
      levelColor: levelInfo.levelData.color,
      xpForNextLevel: levelInfo.xpForNextLevel,
      xpProgress: levelInfo.progress,
      nextLevelName: levelInfo.nextLevelData?.name || null,
    },
  };
};
