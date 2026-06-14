export const queryKeys = {
  gamification: (userId: string) => ['gamification', userId] as const,
  league: (userId: string) => ['league', userId] as const,
  userProfile: (userId: string) => ['user-profile', userId] as const,
  learningProgress: (userId: string, areaId: string) => ['learning-progress', userId, areaId] as const,
};
