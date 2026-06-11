import { COMPETENCY_PHASES } from '@/features/learning/data/competencyPhases';
import { resolvePhaseStatuses } from '@/features/learning/data/phaseProgressUtils';
import { LEARNING_PHASE_SECTION_IDS, phaseToSectionId } from '@/features/learning/constants/learningPhases';
import { applyLessonStatusesToNodes } from '@/features/learning/utils/lessonPathStatus';
import type { PathSection } from '@/features/learning/roadmap/AreaPath';
import type { LearningPathLesson } from '@/features/learning/services/LearningService';
import { AREA_INFO, HOME_AREA_IDS, type AreaId } from '@/shared/constants';
import { resolvePracticeExamMode, type LocalAttemptRecord } from '@/services/demo/mapLocalAttemptToExamResult';
import type {
  ProfileAreaCourseSnapshot,
  ProfileCourseProgressSnapshot,
  ProfilePhaseSnapshot,
} from '../types/profileCourseProgress';

const SECTION_META: Record<(typeof LEARNING_PHASE_SECTION_IDS)[number], { title: string }> = {
  facil: { title: 'Nivel Básico' },
  intermedio: { title: 'Nivel Intermedio' },
  dificil: { title: 'Nivel Avanzado' },
};

export function buildPathSectionsFromLessons(
  lessons: LearningPathLesson[],
  completedLessonIds: string[]
): PathSection[] {
  const groupedSections: PathSection[] = LEARNING_PHASE_SECTION_IDS.map((id) => ({
    id,
    title: SECTION_META[id].title,
    description: '',
    nodes: [],
  }));

  for (const lesson of lessons) {
    const sectionId = phaseToSectionId(lesson.phase);
    const section = groupedSections.find((s) => s.id === sectionId);
    if (!section) continue;

    section.nodes.push({
      id: lesson.id,
      title: lesson.title as string | undefined,
      description: lesson.description as string | undefined,
      xp: lesson.rewards?.xp ?? lesson.xp ?? 0,
      coins: lesson.rewards?.coins ?? lesson.coins ?? 0,
      type: 'lesson',
    });
  }

  const completedSet = new Set(completedLessonIds);
  for (const section of groupedSections) {
    section.nodes = applyLessonStatusesToNodes(section.nodes, completedSet);
  }

  return groupedSections;
}

export type AreaExamCounts = {
  areaGeneral: Partial<Record<AreaId, number>>;
  phaseSkip: Partial<Record<AreaId, number>>;
  total: Partial<Record<AreaId, number>>;
};

export function countExamAttempts(attempts: LocalAttemptRecord[]): {
  globalExamCount: number;
  byArea: Partial<Record<AreaId, number>>;
  areaGeneralByArea: Partial<Record<AreaId, number>>;
  phaseSkipByArea: Partial<Record<AreaId, number>>;
  totalAreaGeneralExamCount: number;
  totalPhaseSkipExamCount: number;
  totalAreaExamCount: number;
} {
  const byArea: Partial<Record<AreaId, number>> = {};
  const areaGeneralByArea: Partial<Record<AreaId, number>> = {};
  const phaseSkipByArea: Partial<Record<AreaId, number>> = {};
  let globalExamCount = 0;

  for (const attempt of attempts) {
    if (attempt.type === 'full-exam') {
      globalExamCount += 1;
      continue;
    }

    const area = attempt.practiceArea;
    if (typeof area !== 'string' || !(area in AREA_INFO) || area === 'examen-completo') {
      continue;
    }

    const areaId = area as AreaId;
    byArea[areaId] = (byArea[areaId] ?? 0) + 1;

    if (resolvePracticeExamMode(attempt) === 'phase-skip') {
      phaseSkipByArea[areaId] = (phaseSkipByArea[areaId] ?? 0) + 1;
    } else {
      areaGeneralByArea[areaId] = (areaGeneralByArea[areaId] ?? 0) + 1;
    }
  }

  const totalAreaGeneralExamCount = Object.values(areaGeneralByArea).reduce((sum, n) => sum + (n ?? 0), 0);
  const totalPhaseSkipExamCount = Object.values(phaseSkipByArea).reduce((sum, n) => sum + (n ?? 0), 0);

  return {
    globalExamCount,
    byArea,
    areaGeneralByArea,
    phaseSkipByArea,
    totalAreaGeneralExamCount,
    totalPhaseSkipExamCount,
    totalAreaExamCount: totalAreaGeneralExamCount + totalPhaseSkipExamCount,
  };
}

function buildAreaSnapshot(
  areaId: AreaId,
  sections: PathSection[],
  skippedSectionIds: Set<string>,
  counts: { general: number; phaseSkip: number; total: number }
): ProfileAreaCourseSnapshot {
  const phaseStatuses = resolvePhaseStatuses(COMPETENCY_PHASES, sections, skippedSectionIds);
  const phases: ProfilePhaseSnapshot[] = COMPETENCY_PHASES.map((phase) => ({
    id: phase.id,
    order: phase.order,
    title: phase.title,
    status: phaseStatuses.get(phase.id) ?? 'upcoming',
  }));

  const currentPhase = phases.find((p) => p.status === 'active') ?? null;
  const hasLessonProgress = sections.some((section) => section.nodes.some((n) => n.status === 'completed'));
  const hasStarted = hasLessonProgress || skippedSectionIds.size > 0 || counts.total > 0;

  return {
    areaId,
    areaName: AREA_INFO[areaId].name,
    icon: AREA_INFO[areaId].icon,
    phases,
    currentPhaseId: currentPhase?.id ?? null,
    areaGeneralExamCount: counts.general,
    phaseSkipExamCount: counts.phaseSkip,
    areaExamCount: counts.total,
    hasStarted,
  };
}

function resolveActiveAreaId(areas: ProfileAreaCourseSnapshot[], attempts: LocalAttemptRecord[]): AreaId | null {
  const started = areas.filter((a) => a.hasStarted);
  if (started.length === 0) return null;

  const latestPractice = [...attempts]
    .filter((a) => a.type !== 'full-exam' && typeof a.practiceArea === 'string')
    .sort(
      (a, b) => new Date(b.date ?? b.completedAt ?? 0).getTime() - new Date(a.date ?? a.completedAt ?? 0).getTime()
    )[0];

  if (latestPractice?.practiceArea && latestPractice.practiceArea in AREA_INFO) {
    return latestPractice.practiceArea as AreaId;
  }

  const withCurrentPhase = started.find((a) => a.currentPhaseId);
  if (withCurrentPhase) return withCurrentPhase.areaId;

  return started[0]?.areaId ?? null;
}

type BuildParams = {
  lessonsByArea: Partial<Record<AreaId, LearningPathLesson[]>>;
  completedLessonIds: string[];
  skippedSectionIdsByArea: Partial<Record<AreaId, Set<string>>>;
  attempts: LocalAttemptRecord[];
  phasesAvailable: boolean;
};

export function buildProfileCourseProgress({
  lessonsByArea,
  completedLessonIds,
  skippedSectionIdsByArea,
  attempts,
  phasesAvailable,
}: BuildParams): ProfileCourseProgressSnapshot {
  const {
    globalExamCount,
    areaGeneralByArea,
    phaseSkipByArea,
    totalAreaGeneralExamCount,
    totalPhaseSkipExamCount,
    totalAreaExamCount,
  } = countExamAttempts(attempts);

  const areas: ProfileAreaCourseSnapshot[] = HOME_AREA_IDS.map((areaId) => {
    const general = areaGeneralByArea[areaId] ?? 0;
    const phaseSkip = phaseSkipByArea[areaId] ?? 0;
    const counts = { general, phaseSkip, total: general + phaseSkip };

    if (!phasesAvailable) {
      return {
        areaId,
        areaName: AREA_INFO[areaId].name,
        icon: AREA_INFO[areaId].icon,
        phases: [],
        currentPhaseId: null,
        areaGeneralExamCount: general,
        phaseSkipExamCount: phaseSkip,
        areaExamCount: counts.total,
        hasStarted: counts.total > 0,
      };
    }

    const lessons = lessonsByArea[areaId] ?? [];
    const sections = buildPathSectionsFromLessons(lessons, completedLessonIds);
    const skipped = skippedSectionIdsByArea[areaId] ?? new Set<string>();
    return buildAreaSnapshot(areaId, sections, skipped, counts);
  });

  const hasAnyActivity = globalExamCount > 0 || totalAreaExamCount > 0 || areas.some((a) => a.hasStarted);

  return {
    activeAreaId: resolveActiveAreaId(areas, attempts),
    areas,
    globalExamCount,
    totalAreaGeneralExamCount,
    totalPhaseSkipExamCount,
    totalAreaExamCount,
    hasAnyActivity,
    phasesAvailable,
  };
}
