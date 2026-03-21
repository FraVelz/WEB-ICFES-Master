// Materiales de aprendizaje por área ICFES
// Este archivo contiene los recursos educativos

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
