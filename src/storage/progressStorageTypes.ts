export interface AreaStatItem {
  name: string;
  correct: number;
  total: number;
  percentage: number;
  icon: string;
  color: string;
}

export interface ProgressData {
  totalAttempts: number;
  totalQuestions: number;
  totalCorrect: number;
  percentage: number;
  streakDays: number;
  lastAttemptDate: string | null;
  bestArea?: AreaStatItem | null;
  weakArea?: AreaStatItem | null;
  areaStats: Record<string, AreaStatItem>;
}

interface AttemptQuestion {
  id: string;
  areaLabel?: string;
  correctAnswer: string;
}

export interface AttemptWithQuestions {
  id?: string | number;
  questions?: AttemptQuestion[];
  answers?: Record<string, string>;
  date?: string;
}

export const LESSON_COMPLETED_EVENT = 'icfes_lesson_completed';

export const STORAGE_KEYS = {
  EXAMS: 'icfes_exams',
  PRACTICE: 'icfes_practice',
  PROGRESS: 'icfes_progress',
  COMPLETED_LESSONS: 'icfes_completed_lessons',
} as const;
