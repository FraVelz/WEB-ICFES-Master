import type { IconName } from '@/shared/components/Icon';

/** Shared user profile shape for UI (Supabase-backed). */
export interface UserProfile {
  id: string | number;
  username?: string | null;
  displayName?: string | null;
  email?: string | null;
  bio?: string | null;
  profileImage?: string | null;
  coinsBalance?: number;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface RankInfo {
  name: string;
  icon: IconName;
  color: string;
  minScore: number;
}

export interface UserRank extends RankInfo {
  percentage: number;
  nextRankPercentage: number | null;
}
