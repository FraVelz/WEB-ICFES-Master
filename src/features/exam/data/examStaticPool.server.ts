import 'server-only';

import {
  ENGLISH_QUESTIONS,
  LANGUAGE_QUESTIONS,
  MATHEMATICS_QUESTIONS,
  SCIENCE_QUESTIONS,
  SOCIAL_QUESTIONS,
} from './questions';
import { FULL_EXAM_ROUTE_AREAS } from './examAreas';
import type { ExamQuestion } from '@/features/exam/types/question';

const STATIC_BY_ROUTE: Record<string, ExamQuestion[]> = {
  'lectura-critica': LANGUAGE_QUESTIONS,
  matematicas: MATHEMATICS_QUESTIONS,
  'ciencias-naturales': SCIENCE_QUESTIONS,
  'sociales-ciudadanas': SOCIAL_QUESTIONS,
  ingles: ENGLISH_QUESTIONS,
};

export function getStaticQuestionsByRouteArea(routeArea: string): ExamQuestion[] {
  return STATIC_BY_ROUTE[routeArea] ?? [];
}

export function getStaticQuestionsForFullExam(): ExamQuestion[] {
  return FULL_EXAM_ROUTE_AREAS.flatMap((area) => getStaticQuestionsByRouteArea(area));
}
