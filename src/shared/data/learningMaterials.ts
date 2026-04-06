// Learning materials by ICFES area
// Educational resources for each area

export interface LearningMaterial {
  id: string;
  title: string;
  description: string;
  difficulty?: string;
  duration?: string;
  lessons?: number;
  path?: string;
  topics: string[];
}

export type LearningMaterialsByArea = Record<string, LearningMaterial[]>;

export const LEARNING_MATERIALS: LearningMaterialsByArea = {};
