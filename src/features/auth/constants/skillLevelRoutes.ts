import { AUTH_DEFAULT_REDIRECT } from '@/features/auth/constants/authRoutes';
import type { SkillLevel } from '@/features/auth/types/skillLevel';

export const LEVEL_ASSESSMENT_PATH = '/evaluacion-nivel';

export const SKILL_LEVEL_DESTINATIONS: Record<
  SkillLevel,
  { path: string; title: string; description: string; icon: string }
> = {
  basics: {
    path: '/ruta-al-500',
    title: 'Estoy aprendiendo las bases',
    description: 'Aún construyo fundamentos. Empieza por la Ruta al 500 y la fase de Cimentación (ND 1–2).',
    icon: 'book',
  },
  intermediate: {
    path: '/practica/matematicas',
    title: 'Tengo un nivel intermedio',
    description: 'Ya manejo conceptos clave y quiero reforzar practicando por áreas.',
    icon: 'chart-line',
  },
  advanced: {
    path: '/examen-completo',
    title: 'Confío en mi conocimiento',
    description: 'Quiero ir directo a practicar exámenes y simulacros tipo ICFES.',
    icon: 'clipboard-list',
  },
};

/** Tras login o evaluación inicial, siempre la ruta de aprendizaje (el nivel solo personaliza recomendaciones). */
export function getPathForSkillLevel(_level: SkillLevel): string {
  return AUTH_DEFAULT_REDIRECT;
}

export function buildLevelAssessmentUrl(context: 'demo' | 'account'): string {
  return `${LEVEL_ASSESSMENT_PATH}?context=${context}`;
}
