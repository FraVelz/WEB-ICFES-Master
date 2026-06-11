import type { RefObject } from 'react';
import type { getAreaInfo } from '@/shared/constants';
import type { useLearningPath } from '@/features/learning/hooks/useLearningPath';
import type { StreakData } from '@/features/learning/shell/SecondaryHeader/StreakModal';
import type { DashboardShellSection } from './shellRoutes';

export type DesktopModal = 'areas' | 'streak' | null;

export type DashboardShellContextValue = {
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
  areaSelectorRef: RefObject<HTMLButtonElement | null>;
  streakButtonRef: RefObject<HTMLButtonElement | null>;
};
