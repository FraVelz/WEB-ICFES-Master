import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useGamificationFirestore } from '@/features/logros/hooks/useGamificationFirestore';
import { getLevelInfo } from '@/features/logros/services/GamificationFirestoreService';
import { getUserProfile } from '@/shared/utils/userProfile';

/**
 * Hook unificado para gestionar perfiles de usuario (localStorage)
 */
export const useUserProfile = (targetUserId = null) => {
  const { user: authUser } = useAuth();
  const uid = targetUserId || authUser?.uid;
  const isOwnProfile = authUser?.uid && uid === authUser.uid;
  const gamification = useGamificationFirestore(uid);

  const [profileData, setProfileData] = useState({
    photoUrl: null,
    name: '',
    personalPhrase: '',
    createdAt: 'Reciente',
    coursesProgress: {},
    loading: true,
    exists: false
  });

  useEffect(() => {
    if (!uid) {
      setProfileData(prev => ({ ...prev, loading: false, exists: false }));
      return;
    }
    const profile = getUserProfile();
    setProfileData({
      photoUrl: profile.profileImage || (isOwnProfile ? authUser?.photoURL : null),
      name: profile.username || authUser?.displayName || 'Usuario',
      personalPhrase: profile.bio || '¡Preparándome para el éxito!',
      createdAt: profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Reciente',
      coursesProgress: profile.coursesProgress || {},
      loading: false,
      exists: true
    });
  }, [uid, authUser, isOwnProfile]);

  const totalXPFromDB = typeof gamification.totalXP === 'number' ? gamification.totalXP : 0;
  const levelInfo = getLevelInfo(totalXPFromDB);

  return {
    uid,
    isOwnProfile,
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
      nextLevelName: levelInfo.nextLevelData?.name || null
    }
  };
};
