'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AREA_INFO, type AreaId } from '@/shared/constants';
import { useLearningPath } from '@/features/learning/hooks/useLearningPath';
import { pickDefaultSectionId } from '@/features/learning/shell/SecondaryHeader/sectionStageUtils';
import { LEARNING_PHASES_PATH, LEARNING_ROADMAP_PATH } from '@/features/learning/data/competencyPhases';
import { isLearningPhasesRoute } from './shellRoutes';

function resolveAreaId(param: string | null): AreaId {
  if (param && param in AREA_INFO) return param as AreaId;
  return 'lectura-critica';
}

function buildLearningSearch(area: string, sectionId?: string): string {
  const params = new URLSearchParams();
  params.set('area', area);
  if (sectionId) params.set('etapa', sectionId);
  return params.toString();
}

export function useDashboardShellLearning(isLearningShell: boolean) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPhasesRoute = isLearningPhasesRoute(pathname);
  const learningPath = isPhasesRoute ? LEARNING_PHASES_PATH : LEARNING_ROADMAP_PATH;

  const [currentArea, setCurrentAreaState] = useState(() => resolveAreaId(searchParams.get('area')));
  const [currentSectionId, setCurrentSectionIdState] = useState<string | undefined>(
    searchParams.get('etapa') ?? undefined
  );

  const replaceLearningUrl = useCallback(
    (area: string, sectionId?: string) => {
      if (!isLearningShell || isPhasesRoute) return;
      const qs = buildLearningSearch(area, sectionId);
      const nextUrl = `${learningPath}?${qs}`;
      const currentQs = searchParams.toString();
      const currentUrl = currentQs ? `${pathname}?${currentQs}` : pathname;
      if (currentUrl === nextUrl) return;
      router.replace(nextUrl, { scroll: false });
    },
    [isLearningShell, isPhasesRoute, learningPath, pathname, router, searchParams]
  );

  const setCurrentArea = useCallback(
    (area: string) => {
      if (!(area in AREA_INFO)) return;
      setCurrentAreaState(area as AreaId);
      if (!isPhasesRoute) replaceLearningUrl(area, currentSectionId);
    },
    [currentSectionId, isPhasesRoute, replaceLearningUrl]
  );

  const setCurrentSectionId = useCallback(
    (id: string | undefined) => {
      setCurrentSectionIdState(id);
      if (id && !isPhasesRoute) replaceLearningUrl(currentArea, id);
    },
    [currentArea, isPhasesRoute, replaceLearningUrl]
  );

  const {
    sections,
    loading: pathLoading,
    error: pathError,
  } = useLearningPath(isLearningShell ? currentArea : undefined, {
    loadAllPhases: isPhasesRoute,
    sectionId: isPhasesRoute ? undefined : currentSectionId,
  });

  const currentSection = sections.find((s) => s.id === currentSectionId);
  const currentSectionIndex = sections.findIndex((s) => s.id === currentSectionId);

  useEffect(() => {
    if (!isLearningShell || isPhasesRoute) return;
    setCurrentAreaState(resolveAreaId(searchParams.get('area')));
    const etapa = searchParams.get('etapa');
    if (etapa) setCurrentSectionIdState(etapa);
  }, [searchParams, isLearningShell, isPhasesRoute]);

  useEffect(() => {
    if (!isLearningShell || pathLoading || isPhasesRoute) return;
    const etapa = searchParams.get('etapa');
    if (etapa && sections.some((s) => s.id === etapa)) {
      setCurrentSectionIdState(etapa);
      return;
    }
    const nextId =
      currentSectionId && sections.some((s) => s.id === currentSectionId)
        ? currentSectionId
        : pickDefaultSectionId(sections);
    if (nextId && nextId !== currentSectionId) {
      setCurrentSectionIdState(nextId);
      if (!etapa) replaceLearningUrl(currentArea, nextId);
    }
  }, [
    currentArea,
    currentSectionId,
    sections,
    pathLoading,
    searchParams,
    isLearningShell,
    isPhasesRoute,
    replaceLearningUrl,
  ]);

  const goToAdjacentSection = useCallback(
    (direction: -1 | 1) => {
      if (currentSectionIndex < 0) return;
      const nextSection = sections[currentSectionIndex + direction];
      if (nextSection) setCurrentSectionId(nextSection.id);
    },
    [currentSectionIndex, sections, setCurrentSectionId]
  );

  return {
    isPhasesRoute,
    currentArea,
    setCurrentArea,
    currentSectionId,
    setCurrentSectionId,
    sections,
    pathLoading,
    pathError,
    currentSection,
    currentSectionIndex,
    goToAdjacentSection,
  };
}
