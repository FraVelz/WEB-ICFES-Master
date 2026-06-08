/** Nivel de preparación ICFES elegido por autodeclaración del usuario. */
export type SkillLevel = 'basics' | 'intermediate' | 'advanced';

export type LevelAssessmentContext = 'demo' | 'account';

export interface LevelAssessmentResult {
  level: SkillLevel;
  completedAt: string;
}
