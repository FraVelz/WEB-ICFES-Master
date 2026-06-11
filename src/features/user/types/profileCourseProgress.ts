import type { AreaId } from '@/shared/constants';
import type { CompetencyPhaseId } from '@/features/learning/data/competencyPhases';
import type { PhaseCardStatus } from '@/features/learning/data/phaseProgressUtils';

export type ProfilePhaseSnapshot = {
  id: CompetencyPhaseId;
  order: number;
  title: string;
  status: PhaseCardStatus;
};

export type ProfileAreaCourseSnapshot = {
  areaId: AreaId;
  areaName: string;
  icon: string;
  phases: ProfilePhaseSnapshot[];
  currentPhaseId: CompetencyPhaseId | null;
  /** Simulacros generales del área (sin saltar fase). */
  areaGeneralExamCount: number;
  /** Exámenes para saltar una fase. */
  phaseSkipExamCount: number;
  /** Total de prácticas por área (general + saltar fase). */
  areaExamCount: number;
  hasStarted: boolean;
};

export type ProfileCourseProgressSnapshot = {
  activeAreaId: AreaId | null;
  areas: ProfileAreaCourseSnapshot[];
  /** Simulacro ICFES completo (todas las áreas). */
  globalExamCount: number;
  /** Suma de simulacros generales por área en todas las materias. */
  totalAreaGeneralExamCount: number;
  /** Suma de exámenes para saltar fase en todas las áreas. */
  totalPhaseSkipExamCount: number;
  /** Total de prácticas por área (general + saltar fase). */
  totalAreaExamCount: number;
  hasAnyActivity: boolean;
  /** Fases con lecciones/saltos — solo en el dispositivo del usuario o datos completos. */
  phasesAvailable: boolean;
};

export const EMPTY_PROFILE_COURSE_PROGRESS: ProfileCourseProgressSnapshot = {
  activeAreaId: null,
  areas: [],
  globalExamCount: 0,
  totalAreaGeneralExamCount: 0,
  totalPhaseSkipExamCount: 0,
  totalAreaExamCount: 0,
  hasAnyActivity: false,
  phasesAvailable: false,
};
