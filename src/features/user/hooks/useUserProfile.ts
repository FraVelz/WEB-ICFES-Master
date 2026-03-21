import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useGamification } from '@/features/logros/hooks/useGamification';
import { getLevelInfo } from '@/features/logros/utils/gamificationUtils';
import { RANKS } from '@/features/logros/constants/ranks';
import { getUserProfile } from '@/shared/utils/userProfile';

const levelToRankId = (level: number): string => {
  const rankOrder = Math.min(Math.max(level, 1), 7);
  const rank = Object.values(RANKS).find((r) => r.order === rankOrder);
  return rank?.id ?? 'novato';
};

/**
 * Hook unificado para gestionar perfiles de usuario (localStorage)
 */
export const useUserProfile = (targetUserId: string | null = null) => {
  const { user: authUser } = useAuth();
  const uid = targetUserId || authUser?.uid;
  const isOwnProfile = authUser?.uid && uid === authUser.uid;
  const gamification = useGamification(uid);

  const [profileData, setProfileData] = useState<{
    photoUrl: string | null;
    name: string;
    personalPhrase: string;
    createdAt: string;
    coursesProgress: Record<string, unknown>;
    loading: boolean;
    exists: boolean;
  }>({
    photoUrl: null,
    name: '',
    personalPhrase: '',
    createdAt: 'Reciente',
    coursesProgress: {},
    loading: true,
    exists: false,
  });

  useEffect(() => {
    if (!uid) {
      setProfileData((prev) => ({ ...prev, loading: false, exists: false }));
      return;
    }
    const profile = getUserProfile();
    setProfileData({
      photoUrl:
        profile.profileImage || (isOwnProfile ? authUser?.photoURL : null),
      name: profile.username || authUser?.displayName || 'Usuario',
      personalPhrase: profile.bio || '¡Preparándome para el éxito!',
      createdAt: profile.createdAt
        ? new Date(profile.createdAt).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : 'Reciente',
      coursesProgress: (profile as { coursesProgress?: Record<string, unknown> }).coursesProgress || {},
      loading: false,
      exists: true,
    });
  }, [uid, authUser, isOwnProfile]);

  const totalXPFromDB =
    typeof gamification.totalXP === 'number' ? gamification.totalXP : 0;
  const levelInfo = getLevelInfo(totalXPFromDB);

  const rank = levelToRankId(levelInfo.level);

  return {
    uid,
    isOwnProfile,
    rank,
    ...profileData,
    ...gamification,
    totalXP: totalXPFromDB,
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
