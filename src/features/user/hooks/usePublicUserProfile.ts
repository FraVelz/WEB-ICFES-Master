'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { ACHIEVEMENTS_DATA } from '@/shared/constants/achievementsData';
import { getLevelInfo } from '@/services/gamification/gamificationUtils';
import { RANKS } from '@/shared/constants/ranks';
import { normalizeAchievementsRecord } from '@/services/achievements/achievementProgressService';
import type { ImageSource } from '@/assets';
import { resolveProfileAvatarSrc } from '@/features/user/utils/resolveProfileAvatar';

export type PublicProfileErrorCode = 'invalid_id' | 'not_found' | 'unavailable' | 'server' | 'network' | null;

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const levelToRankId = (level: number): string => {
  const rankOrder = Math.min(Math.max(level, 1), 7);
  const rank = Object.values(RANKS).find((r) => r.order === rankOrder);
  return rank?.id ?? 'novato';
};

function mergeAchievements(achProgress: Record<string, { current?: number; unlocked?: boolean; unlockedAt?: string | null }>) {
  return ACHIEVEMENTS_DATA.map((a) => {
    const p = achProgress[a.id] ?? {};
    const current = p.current ?? 0;
    const unlocked = p.unlocked ?? false;
    return {
      ...a,
      progress: current,
      unlockedAt: p.unlockedAt || null,
      status: unlocked ? 'completed' : current > 0 ? 'in_progress' : 'incomplete',
    };
  });
}

type PublicProfileApiResponse = {
  profile: {
    id: string;
    displayName: string | null;
    username: string | null;
    bio: string | null;
    profileImage: string | null;
    createdAt: string | null;
  };
  gamification: {
    xp: number;
    achievements: Record<string, unknown>;
    equippedLogoId?: string | null;
  };
};

export function usePublicUserProfile(userId: string | null) {
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [exists, setExists] = useState(false);
  const [errorCode, setErrorCode] = useState<PublicProfileErrorCode>(null);
  const [profileImage, setProfileImage] = useState<ImageSource | null>(null);
  const [name, setName] = useState('');
  const [personalPhrase, setPersonalPhrase] = useState('');
  const [createdAt, setCreatedAt] = useState('Reciente');
  const [achievements, setAchievements] = useState<ReturnType<typeof mergeAchievements>>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setExists(false);
      setErrorCode('invalid_id');
      return;
    }

    if (!UUID_REGEX.test(userId)) {
      setLoading(false);
      setExists(false);
      setErrorCode('invalid_id');
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setErrorCode(null);

      try {
        const response = await fetch(`/api/profile/public/${encodeURIComponent(userId)}`, {
          cache: 'no-store',
        });

        if (!response.ok) {
          const body = (await response.json().catch(() => ({}))) as { error?: PublicProfileErrorCode };
          if (!cancelled) {
            setExists(false);
            setErrorCode(body.error ?? (response.status === 404 ? 'not_found' : 'server'));
            setLoading(false);
          }
          return;
        }

        const payload = (await response.json()) as PublicProfileApiResponse;
        if (cancelled) return;

        const levelInfo = getLevelInfo(payload.gamification.xp ?? 0);
        const mergedAchievements = mergeAchievements(
          normalizeAchievementsRecord(payload.gamification.achievements)
        );

        setProfileImage(
          resolveProfileAvatarSrc(
            payload.profile.profileImage,
            payload.gamification.equippedLogoId ?? null
          )
        );
        setName(payload.profile.username ?? payload.profile.displayName ?? 'Usuario');
        setPersonalPhrase(payload.profile.bio ?? '¡Preparándome para el éxito!');
        setCreatedAt(
          payload.profile.createdAt
            ? new Date(payload.profile.createdAt).toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : 'Reciente'
        );
        setTotalXP(payload.gamification.xp ?? 0);
        setLevel(levelInfo.level);
        setAchievements(mergedAchievements);
        setCompletedCount(mergedAchievements.filter((a) => a.status === 'completed').length);
        setExists(true);
        setErrorCode(null);
      } catch {
        if (!cancelled) {
          setExists(false);
          setErrorCode('network');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const levelInfo = getLevelInfo(totalXP);
  const rank = levelToRankId(levelInfo.level);
  const isOwnProfile = Boolean(authUser?.uid && userId === authUser.uid);

  return {
    uid: userId,
    isOwnProfile,
    rank,
    profileImage,
    name,
    personalPhrase,
    createdAt,
    coursesProgress: {} as Record<string, unknown>,
    achievements,
    totalXP,
    level,
    completedCount,
    loading,
    exists,
    errorCode,
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
}
