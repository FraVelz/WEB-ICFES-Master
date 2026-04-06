// ICFES-area question data
// Questions grouped by area

import type { ExamQuestion } from '@/shared/types/question';

export const MATHEMATICS_QUESTIONS: ExamQuestion[] = [];
export const LANGUAGE_QUESTIONS: ExamQuestion[] = [];
export const SCIENCE_QUESTIONS: ExamQuestion[] = [];
export const SOCIAL_QUESTIONS: ExamQuestion[] = [];

export const ALL_QUESTIONS: ExamQuestion[] = [
  ...MATHEMATICS_QUESTIONS,
  ...LANGUAGE_QUESTIONS,
  ...SCIENCE_QUESTIONS,
  ...SOCIAL_QUESTIONS,
];
