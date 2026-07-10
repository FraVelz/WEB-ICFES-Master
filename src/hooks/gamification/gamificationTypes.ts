const STREAK_ACHIEVEMENT_ID = 'const_1';

export type AchievementProgressEntry = {
  current?: number;
  unlocked?: boolean;
  unlockedAt?: string | null;
};

export type AchievementProgressRecord = Record<string, AchievementProgressEntry>;

export interface AchievementMerged {
  progress: number;
  unlockedAt: string | null;
  status: string;
  id: string;
  category: string;
  title: string;
  description: string;
  icon: string;
  target: number;
  xpReward: number;
  coinsReward: number;
  [key: string]: unknown;
}
