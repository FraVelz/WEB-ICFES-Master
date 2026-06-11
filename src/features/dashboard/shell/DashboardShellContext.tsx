'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useGamification } from '@/hooks/gamification';
import { useUiSessionStore } from '@/store/uiSessionStore';
import { getStreakScope } from '@/services/streak';
import { AREA_INFO, getAreaInfo, type AreaId } from '@/shared/constants';
import { useLearningPath } from '@/features/learning/hooks/useLearningPath';
import { pickDefaultSectionId } from '@/features/learning/shell/SecondaryHeader/sectionStageUtils';
import type { StreakData } from '@/features/learning/shell/SecondaryHeader/StreakModal';
import { LEARNING_PHASES_PATH, LEARNING_ROADMAP_PATH } from '@/features/learning/data/competencyPhases';
import {
  isLearningPhasesRoute,
  resolveDashboardShellSection,
  type DashboardShellSection,
} from './shellRoutes';

type DesktopModal = 'areas' | 'streak' | null;

type DashboardShellContextValue = {
  shellSection: DashboardShellSection;
  isPhasesRoute: boolean;
  currentArea: string;
  setCurrentArea: (area: string) => void;
  currentSectionId: string | undefined;
  setCurrentSectionId: (id: string | undefined) => void;
  sections: ReturnType<typeof useLearningPath>['sections'];
  pathLoading: boolean;
  pathError: string | null;
  currentAreaData: ReturnType<typeof getAreaInfo>;
  currentSection: ReturnType<typeof useLearningPath>['sections'][number] | undefined;
  currentSectionIndex: number;
  goToAdjacentSection: (direction: -1 | 1) => void;
  currentStreak: number;
  coins: number;
  statsLoading: boolean;
  streakData: StreakData;
  desktopModal: DesktopModal;
  setDesktopModal: (modal: DesktopModal) => void;
  areaSelectorRef: React.RefObject<HTMLButtonElement | null>;
  streakButtonRef: React.RefObject<HTMLButtonElement | null>;
};

const DashboardShellContext = createContext<DashboardShellContextValue | null>(null);

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

export function DashboardShellProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const shellSection = resolveDashboardShellSection(pathname);
  const isPhasesRoute = isLearningPhasesRoute(pathname);
  const isLearningShell = shellSection === 'learning';
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
  const [desktopModal, setDesktopModal] = useState<DesktopModal>(null);

  const areaSelectorRef = useRef<HTMLButtonElement>(null);
  const streakButtonRef = useRef<HTMLButtonElement>(null);

  const { user } = useAuth();
  const demoMode = useUiSessionStore((state) => state.demoMode);
  const streakScope = getStreakScope(user?.uid, demoMode) ?? undefined;
  const {
    currentStreak = 0,
    longestStreak = 0,
    coins = 0,
    streak = [],
    loading: statsLoading,
  } = useGamification(streakScope);

  const { sections, loading: pathLoading, error: pathError } = useLearningPath(isLearningShell ? currentArea : undefined, {
    loadAllPhases: isPhasesRoute,
    sectionId: isPhasesRoute ? undefined : currentSectionId,
  });

  const currentAreaData = getAreaInfo(currentArea);
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

  const streakData = useMemo(
    () => ({
      currentStreak,
      longestStreak,
      streakHistory: streak,
      isBadgeUnlocked: currentStreak >= 7,
      daysUntilBadge: Math.max(0, 7 - currentStreak),
    }),
    [currentStreak, longestStreak, streak]
  );

  const value = useMemo(
    (): DashboardShellContextValue => ({
      shellSection,
      isPhasesRoute,
      currentArea,
      setCurrentArea,
      currentSectionId,
      setCurrentSectionId,
      sections,
      pathLoading,
      pathError,
      currentAreaData,
      currentSection,
      currentSectionIndex,
      goToAdjacentSection,
      currentStreak,
      coins,
      statsLoading,
      streakData,
      desktopModal,
      setDesktopModal,
      areaSelectorRef,
      streakButtonRef,
    }),
    [
      shellSection,
      isPhasesRoute,
      currentArea,
      currentSectionId,
      sections,
      pathLoading,
      pathError,
      currentAreaData,
      currentSection,
      currentSectionIndex,
      goToAdjacentSection,
      currentStreak,
      coins,
      statsLoading,
      streakData,
      desktopModal,
      setCurrentArea,
    ]
  );

  return <DashboardShellContext.Provider value={value}>{children}</DashboardShellContext.Provider>;
}

export function useDashboardShell() {
  const ctx = useContext(DashboardShellContext);
  if (!ctx) {
    throw new Error('useDashboardShell debe usarse dentro de DashboardShellProvider');
  }
  return ctx;
}

export function useDashboardShellOptional() {
  return useContext(DashboardShellContext);
}
