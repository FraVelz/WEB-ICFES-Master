import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useGamification, useGamificationScope } from '@/hooks/gamification';
import { getLevelInfo } from '@/services/gamification/gamificationUtils';
import { RANKS } from '@/shared/constants/ranks';
import { getDemoProfile } from '@/services/demo/demoProfile';
import { isDemoUserId } from '@/services/demo/demoCoins';
import UserSupabaseService from '@/services/supabase/UserSupabaseService';
import { isSupabaseConfigured } from '@/services/persistence/supabaseConfigured';
import { getStudyTimeStats, STUDY_TIME_UPDATED_EVENT } from '@/services/studyTime';
import { USER_PROFILE_CHANGE_EVENT, type UserProfileChangeDetail } from '@/services/persistence';

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
  const isOwnProfile = authUser?.uid && uid === authUser.uid;
  const streakScope = targetUserId ? (isDemoUserId(targetUserId) ? 'demo' : targetUserId) : ownGamificationScope;
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
  } = useGamification(streakScope);

  const [profileData, setProfileData] = useState<{
    profileImage: string | null;
    name: string;
    personalPhrase: string;
    createdAt: string;
    coursesProgress: Record<string, unknown>;
    loading: boolean;
    exists: boolean;
  }>({
    profileImage: null,
    name: '',
    personalPhrase: '',
    createdAt: 'Reciente',
    coursesProgress: {},
    loading: true,
    exists: false,
  });

  const [studyTimeMinutes, setStudyTimeMinutes] = useState(0);

  useEffect(() => {
    if (!uid) {
      setStudyTimeMinutes(0);
      return;
    }

    const refreshStudyTime = () => {
      const localMinutes = getStudyTimeStats(uid).totalMinutes;
      setStudyTimeMinutes(localMinutes);
    };

    refreshStudyTime();
    window.addEventListener(STUDY_TIME_UPDATED_EVENT, refreshStudyTime);
    return () => window.removeEventListener(STUDY_TIME_UPDATED_EVENT, refreshStudyTime);
  }, [uid]);

  useEffect(() => {
    if (!uid) {
      if (!authLoading) {
        setProfileData((prev) => ({ ...prev, loading: false, exists: false }));
      }
      return;
    }

    let cancelled = false;

    const load = async () => {
      const canShowAuthShell = Boolean(isOwnProfile && authUser);
      if (!canShowAuthShell) {
        setProfileData((prev) => ({ ...prev, loading: true }));
      }

      if (isDemoUserId(uid)) {
        const demo = getDemoProfile();
        if (cancelled) return;
        setProfileData({
          profileImage: null,
          name: demo.username ?? 'Estudiante',
          personalPhrase: demo.bio ?? '',
          createdAt: 'Modo demo',
          coursesProgress: {},
          loading: false,
          exists: true,
        });
        return;
      }

      if (!isSupabaseConfigured()) {
        if (cancelled) return;
        setProfileData((prev) => ({ ...prev, loading: false, exists: false }));
        return;
      }

      try {
        const profile = await UserSupabaseService.getByUserId(uid);
        if (cancelled) return;

        if (!profile) {
          setProfileData((prev) => ({ ...prev, loading: false, exists: false }));
          return;
        }

        setProfileData({
          profileImage: profile.profileImage ?? (isOwnProfile ? authUser?.profileImage : null),
          name: profile.username ?? profile.displayName ?? 'Usuario',
          personalPhrase: profile.bio ?? '¡Preparándome para el éxito!',
          createdAt: profile.createdAt
            ? new Date(profile.createdAt).toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : 'Reciente',
          coursesProgress: {},
          loading: false,
          exists: true,
        });
      } catch {
        if (!cancelled) {
          setProfileData((prev) => ({ ...prev, loading: false, exists: false }));
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [uid, authUser, isOwnProfile, authLoading]);

  useEffect(() => {
    if (!isOwnProfile || !authUser?.uid || authLoading) return;

    setProfileData((prev) => ({
      ...prev,
      profileImage: authUser.profileImage ?? prev.profileImage,
      name: authUser.displayName ?? prev.name ?? 'Usuario',
      exists: true,
      loading: false,
    }));
  }, [isOwnProfile, authUser, authLoading]);

  useEffect(() => {
    if (!isOwnProfile) return;

    const onProfileChanged = (event: Event) => {
      const detail = (event as CustomEvent<UserProfileChangeDetail>).detail;
      if (!detail) return;

      setProfileData((prev) => ({
        ...prev,
        ...(detail.profileImage !== undefined ? { profileImage: detail.profileImage } : {}),
        ...(detail.username !== undefined ? { name: detail.username ?? prev.name } : {}),
        ...(detail.bio !== undefined ? { personalPhrase: detail.bio ?? prev.personalPhrase } : {}),
      }));
    };

    window.addEventListener(USER_PROFILE_CHANGE_EVENT, onProfileChanged);
    return () => window.removeEventListener(USER_PROFILE_CHANGE_EVENT, onProfileChanged);
  }, [isOwnProfile]);

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
