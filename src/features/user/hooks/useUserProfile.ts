import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useGamification } from '@/hooks/gamification';
import { getLevelInfo } from '@/services/gamification/gamificationUtils';
import { RANKS } from '@/shared/constants/ranks';
import { getDemoProfile } from '@/services/demo/demoProfile';
import { isDemoUserId } from '@/services/demo/demoCoins';
import UserSupabaseService from '@/services/supabase/UserSupabaseService';
import { isSupabaseConfigured } from '@/services/persistence/supabaseConfigured';

const levelToRankId = (level: number): string => {
  const rankOrder = Math.min(Math.max(level, 1), 7);
  const rank = Object.values(RANKS).find((r) => r.order === rankOrder);
  return rank?.id ?? 'novato';
};

/**
 * Profile view — Supabase for real users, demo profile for demo scope.
 */
export const useUserProfile = (targetUserId: string | null = null) => {
  const { user: authUser } = useAuth();
  const uid = targetUserId || authUser?.uid;
  const isOwnProfile = authUser?.uid && uid === authUser.uid;
  const streakScope = uid ? (isDemoUserId(uid) ? 'demo' : uid) : undefined;
  const gamification = useGamification(streakScope);

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

    let cancelled = false;

    const load = async () => {
      setProfileData((prev) => ({ ...prev, loading: true }));

      if (isDemoUserId(uid)) {
        const demo = getDemoProfile();
        if (cancelled) return;
        setProfileData({
          photoUrl: null,
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
          photoUrl: profile.profileImage ?? (isOwnProfile ? authUser?.photoURL : null),
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
  }, [uid, authUser, isOwnProfile]);

  const totalXPFromDB = typeof gamification.totalXP === 'number' ? gamification.totalXP : 0;
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
