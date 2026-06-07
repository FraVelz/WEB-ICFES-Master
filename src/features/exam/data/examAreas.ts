/** Área en Supabase (`exam_questions.area`) */
export type ExamQuestionDbArea = 'matematicas' | 'lectura_critica' | 'ciencias_naturales' | 'sociales' | 'ingles';

/** Slug de ruta en la app (`/practica/[area]`) */
export type ExamQuestionRouteArea =
  | 'matematicas'
  | 'lectura-critica'
  | 'ciencias-naturales'
  | 'sociales-ciudadanas'
  | 'ingles';

export const EXAM_ROUTE_TO_DB_AREA: Record<ExamQuestionRouteArea, ExamQuestionDbArea> = {
  matematicas: 'matematicas',
  'lectura-critica': 'lectura_critica',
  'ciencias-naturales': 'ciencias_naturales',
  'sociales-ciudadanas': 'sociales',
  ingles: 'ingles',
};

export const FULL_EXAM_ROUTE_AREAS: ExamQuestionRouteArea[] = [
  'matematicas',
  'lectura-critica',
  'ciencias-naturales',
  'sociales-ciudadanas',
];

export function routeAreaToDbArea(routeArea: string): ExamQuestionDbArea | null {
  return (EXAM_ROUTE_TO_DB_AREA as Record<string, ExamQuestionDbArea | undefined>)[routeArea] ?? null;
}

export function isExamQuestionRouteArea(value: string): value is ExamQuestionRouteArea {
  return value in EXAM_ROUTE_TO_DB_AREA;
}
