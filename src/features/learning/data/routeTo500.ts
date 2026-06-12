import type { SkillLevel } from '@/features/auth/types/skillLevel';
import type { AreaId } from '@/shared/constants';
import { getAreaInfo, getPracticaHrefForRoadmapArea } from '@/shared/constants';
import {
  COMPETENCY_PHASES,
  JOURNEY_TIPS,
  type CompetencyPhaseId,
  getRoadmapHref,
} from './competencyPhases';

export const ROUTE_TO_500_PATH = '/ruta-al-500';
export const GLOBAL_EXAM_PATH = '/examen-completo';

export type JourneyStepKind = 'learning' | 'practice-area' | 'practice-global';

export type JourneyStepId =
  | CompetencyPhaseId
  | 'examen-materia'
  | 'examen-global';

export type JourneyStepAccent = 'accent' | 'amber' | 'purple';

export type JourneyStep = {
  id: JourneyStepId;
  order: 1 | 2 | 3 | 4 | 5;
  title: string;
  subtitle: string;
  summary: string;
  /** Marco ICFES (Niveles de desempeño u otro descriptor). */
  performanceLevels: string;
  /** Rango orientativo; no equivalencia oficial con Saber 11°. */
  indicativeScoreLabel: string;
  kind: JourneyStepKind;
  sectionId?: 'facil' | 'intermedio' | 'dificil';
  competencyPhaseId?: CompetencyPhaseId;
  accent: JourneyStepAccent;
};

export const ROUTE_TO_500_DISCLAIMER =
  'Los rangos de puntaje mostrados son una guía de estudio orientativa. Dependen de tu punto de partida, ' +
  'constancia y del examen real. ICFES Master es una herramienta de práctica, no una predicción oficial del ICFES.';

export const ROUTE_TO_500_CLARITY_ITEMS = [
  {
    title: 'Puntaje Saber 11°',
    description: 'Escala 0–500 por área y global. Es el resultado del examen oficial.',
  },
  {
    title: 'Nivel de desempeño (ND 1–4)',
    description: 'Marco ICFES por área: mide competencias, no memorización de datos aislados.',
  },
  {
    title: 'Tu avance en ICFES Master',
    description: 'Lecciones completadas, simulacros y XP. Mide práctica en la plataforma, no el puntaje oficial.',
  },
] as const;

const LEARNING_STEPS: JourneyStep[] = COMPETENCY_PHASES.map((phase) => {
  const performanceLevels =
    phase.order === 1 ? 'ND 1–2' : phase.order === 2 ? 'ND 2–3' : 'ND 3–4';
  const indicativeScoreLabel =
    phase.order === 1 ? '~ 0 – 250 pts' : phase.order === 2 ? '~ 250 – 300 pts' : '~ 300 – 350 pts';

  return {
    id: phase.id,
    order: phase.order as 1 | 2 | 3,
    title: phase.title,
    subtitle: phase.subtitle,
    summary: phase.summary,
    performanceLevels,
    indicativeScoreLabel,
    kind: 'learning' as const,
    sectionId: phase.sectionId as 'facil' | 'intermedio' | 'dificil',
    competencyPhaseId: phase.id,
    accent: 'accent' as const,
  };
});

const EXAM_STEPS: JourneyStep[] = [
  {
    id: 'examen-materia',
    order: 4,
    title: 'Simulacro general por materia',
    subtitle: 'Consolidación por área',
    summary:
      'Simulacro completo de cada área para consolidar las tres fases anteriores antes del simulacro integral.',
    performanceLevels: 'Transferencia',
    indicativeScoreLabel: '~ 350 – 400 pts',
    kind: 'practice-area',
    accent: 'amber',
  },
  {
    id: 'examen-global',
    order: 5,
    title: 'Simulacro global e interiorización',
    subtitle: 'Simulacro integral',
    summary:
      'Completa todos los pasos anteriores. La lectura crítica atraviesa todas las áreas y condiciona tu ' +
      'desempeño global en el Saber 11°.',
    performanceLevels: 'Consolidación',
    indicativeScoreLabel: '~ 400 – 500 pts',
    kind: 'practice-global',
    accent: 'purple',
  },
];

export function getAreaSimulacroPhaseTitle(areaName: string): string {
  return `Simulacro general de ${areaName}`;
}

export function getAreaSimulacroPhaseSummary(areaName: string): string {
  return (
    `Simulacro completo de ${areaName} para consolidar las tres fases anteriores ` +
    'antes del simulacro integral.'
  );
}

export function getAreaSimulacroPhaseCopy(areaId: AreaId): { title: string; summary: string } {
  const areaName = getAreaInfo(areaId).name;
  return {
    title: getAreaSimulacroPhaseTitle(areaName),
    summary: getAreaSimulacroPhaseSummary(areaName),
  };
}

export const ROUTE_TO_500_STEPS: JourneyStep[] = [...LEARNING_STEPS, ...EXAM_STEPS];

export const SKILL_LEVEL_RECOMMENDED_STEP: Record<SkillLevel, JourneyStepId> = {
  basics: 'cimentacion',
  intermediate: 'relacion',
  advanced: 'maestria',
};

export const SKILL_LEVEL_RECOMMENDATION_COPY: Record<SkillLevel, string> = {
  basics: 'Según tu evaluación, te recomendamos empezar en Cimentación (ND 1–2).',
  intermediate:
    'Según tu evaluación, puedes entrar en Relación (ND 2–3). Repasa Cimentación si los simulacros te lo piden.',
  advanced:
    'Según tu evaluación, puedes avanzar a Maestría (ND 3–4) o usar un simulacro para saltar fases si ya dominas el contenido.',
};

export function getJourneyStepById(stepId: JourneyStepId): JourneyStep | undefined {
  return ROUTE_TO_500_STEPS.find((step) => step.id === stepId);
}

export function getJourneyStepForCompetencyPhase(phaseId: CompetencyPhaseId): JourneyStep | undefined {
  return ROUTE_TO_500_STEPS.find((step) => step.competencyPhaseId === phaseId);
}

export function getJourneyStepHref(step: JourneyStep, areaId: AreaId = 'lectura-critica'): string | null {
  if (step.kind === 'learning' && step.sectionId) {
    return getRoadmapHref(step.sectionId);
  }
  if (step.kind === 'practice-area') {
    return getPracticaHrefForRoadmapArea(areaId);
  }
  if (step.kind === 'practice-global') {
    return GLOBAL_EXAM_PATH;
  }
  return null;
}

export function getRecommendedStepHref(level: SkillLevel, areaId: AreaId = 'lectura-critica'): string | null {
  const step = getJourneyStepById(SKILL_LEVEL_RECOMMENDED_STEP[level]);
  return step ? getJourneyStepHref(step, areaId) : null;
}

export { JOURNEY_TIPS };
