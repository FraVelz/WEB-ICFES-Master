export type AchievementProgressEntry = {
  current: number;
  unlocked: boolean;
  unlockedAt: string | null;
};

export type AchievementProgressMap = Record<string, AchievementProgressEntry>;

export type SyncAchievementsOptions = {
  /** Evita un getOrCreate extra si el caller ya tiene logros remotos. */
  remoteAchievements?: AchievementProgressMap;
  /** Evita leer XP otra vez al calcular meta_1. */
  userLevel?: number;
  /** Evita recargar racha dentro del sync si el caller ya la tiene. */
  currentStreak?: number;
  longestStreak?: number;
};

export type SyncAchievementsResult = {
  progress: AchievementProgressMap;
  progressChanged: boolean;
  hadNewUnlocks: boolean;
};
