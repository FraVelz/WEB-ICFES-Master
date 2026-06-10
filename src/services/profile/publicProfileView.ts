import { ACHIEVEMENTS_DATA } from '@/shared/constants/achievementsData';
import { getLevelInfo } from '@/services/gamification/gamificationUtils';
import { RANKS } from '@/shared/constants/ranks';
import { normalizeAchievementsRecord } from '@/services/achievements/achievementProgressService';
import type { ImageSource } from '@/assets';
import { resolveProfileAvatarSrc } from '@/features/user/utils/resolveProfileAvatar';
import type { PublicProfilePayload } from './publicProfileServer';

export type PublicProfileErrorCode = 'invalid_id' | 'not_found' | 'unavailable' | 'server' | 'network' | null;

export const PUBLIC_PROFILE_UUID_REGEX =
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

export type PublicProfileViewState = {
  userId: string | null;
  errorCode: PublicProfileErrorCode;
  exists: boolean;
  profileImage: ImageSource | null;
  name: string;
  personalPhrase: string;
  createdAt: string;
  achievements: ReturnType<typeof mergeAchievements>;
  totalXP: number;
  level: number;
  completedCount: number;
  rank: string;
  levelInfo: {
    level: number;
    levelName: string;
    levelIcon: string;
    levelColor: string;
    xpForNextLevel: number | null;
    xpProgress: number;
    nextLevelName: string | null;
  };
  coursesProgress: Record<string, unknown>;
};

const EMPTY_VIEW: Omit<PublicProfileViewState, 'userId' | 'errorCode' | 'exists'> = {
  profileImage: null,
  name: '',
  personalPhrase: '',
  createdAt: 'Reciente',
  achievements: [],
  totalXP: 0,
  level: 1,
  completedCount: 0,
  rank: 'novato',
  levelInfo: {
    level: 1,
    levelName: '',
    levelIcon: 'star',
    levelColor: '',
    xpForNextLevel: null,
    xpProgress: 0,
    nextLevelName: null,
  },
  coursesProgress: {},
};

export function buildPublicProfileViewState(
  userId: string | null,
  payload: PublicProfilePayload | null,
  errorCode: PublicProfileErrorCode
): PublicProfileViewState {
  if (!userId || errorCode === 'invalid_id' || !payload) {
    return {
      userId,
      errorCode: errorCode ?? (userId ? 'not_found' : 'invalid_id'),
      exists: false,
      ...EMPTY_VIEW,
    };
  }

  const levelInfo = getLevelInfo(payload.gamification.xp ?? 0);
  const mergedAchievements = mergeAchievements(
    normalizeAchievementsRecord(payload.gamification.achievements)
  );

  return {
    userId,
    errorCode: null,
    exists: true,
    profileImage: resolveProfileAvatarSrc(
      payload.profile.profileImage,
      payload.gamification.equippedLogoId ?? null
    ),
    name: payload.profile.username ?? payload.profile.displayName ?? 'Usuario',
    personalPhrase: payload.profile.bio ?? '¡Preparándome para el éxito!',
    createdAt: payload.profile.createdAt
      ? new Date(payload.profile.createdAt).toLocaleDateString('es-CO', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'Reciente',
    totalXP: payload.gamification.xp ?? 0,
    level: levelInfo.level,
    achievements: mergedAchievements,
    completedCount: mergedAchievements.filter((a) => a.status === 'completed').length,
    rank: levelToRankId(levelInfo.level),
    levelInfo: {
      level: levelInfo.level,
      levelName: levelInfo.levelData.name,
      levelIcon: levelInfo.levelData.icon,
      levelColor: levelInfo.levelData.color,
      xpForNextLevel: levelInfo.xpForNextLevel,
      xpProgress: levelInfo.progress,
      nextLevelName: levelInfo.nextLevelData?.name || null,
    },
    coursesProgress: {},
  };
}
