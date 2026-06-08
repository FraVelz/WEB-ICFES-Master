import type { SkillLevel } from '@/features/auth/types/skillLevel';

export const LEVEL_ASSESSMENT_PATH = '/evaluacion-nivel';

export const SKILL_LEVEL_DESTINATIONS: Record<
  SkillLevel,
  { path: string; title: string; description: string; icon: string }
> = {
  basics: {
    path: '/ruta-aprendizaje',
    title: 'Estoy aprendiendo las bases',
    description: 'Aún construyo fundamentos y prefiero empezar con lecciones guiadas paso a paso.',
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

export function getPathForSkillLevel(level: SkillLevel): string {
  return SKILL_LEVEL_DESTINATIONS[level].path;
}

export function buildLevelAssessmentUrl(context: 'demo' | 'account'): string {
  return `${LEVEL_ASSESSMENT_PATH}?context=${context}`;
}
