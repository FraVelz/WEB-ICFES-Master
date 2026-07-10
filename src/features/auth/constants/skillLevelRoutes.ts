import { AUTH_DEFAULT_REDIRECT } from '@/features/auth/constants/authRoutes';
import type { SkillLevel } from '@/features/auth/types/skillLevel';
import { SIMULACRO_COMPLETO_SECTION_PATH } from '@/features/exam/utils/simulacroNavigation';
import { getRoadmapHref } from '@/features/learning/data/competencyPhases';
import { ROUTE_TO_500_PATH } from '@/features/learning/data/routeTo500';

export const LEVEL_ASSESSMENT_PATH = '/evaluacion-nivel';

/** Fase 1 (Cimentación) de Lectura Crítica en la ruta de aprendizaje. */
const SKILL_LEVEL_BASICS_PATH = getRoadmapHref('facil', 'lectura-critica');

export const SKILL_LEVEL_DESTINATIONS: Record<
  SkillLevel,
  { path: string; title: string; description: string; icon: string }
> = {
  basics: {
    path: SKILL_LEVEL_BASICS_PATH,
    title: 'Estoy aprendiendo las bases',
    description: 'Aún construyo fundamentos. Empieza por la Ruta al 500 y la fase de Cimentación (ND 1–2).',
    icon: 'book',
  },
  intermediate: {
    path: ROUTE_TO_500_PATH,
    title: 'Tengo un nivel intermedio',
    description: 'Ya manejo conceptos clave y quiero reforzar practicando por áreas.',
    icon: 'chart-line',
  },
  advanced: {
    path: SIMULACRO_COMPLETO_SECTION_PATH,
    title: 'Confío en mi conocimiento',
    description: 'Quiero ir directo a practicar exámenes y simulacros tipo ICFES.',
    icon: 'clipboard-list',
  },
};

/** Destino tras completar la evaluación inicial según la opción elegida. */
export function getPathForSkillLevel(level: SkillLevel): string {
  return SKILL_LEVEL_DESTINATIONS[level]?.path ?? AUTH_DEFAULT_REDIRECT;
}

export function buildLevelAssessmentUrl(context: 'demo' | 'account'): string {
  return `${LEVEL_ASSESSMENT_PATH}?context=${context}`;
}
