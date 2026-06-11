'use client';

import { cn } from '@/utils/cn';
import dynamic from 'next/dynamic';
import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useGamification } from '@/hooks/gamification';
import { useUiSessionStore } from '@/store/uiSessionStore';
import { getStreakScope } from '@/services/streak';

import { AreaPath } from './AreaPath';
import { LessonAreaLinks } from './LessonAreaLinks';
import { SecondaryHeader } from '../shell/SecondaryHeader';
import { SectionStageBanner } from '../shell/SecondaryHeader/SectionStageBanner';
import { AreasModal } from '../shell/SecondaryHeader/AreasModal';
import { SectionsModal } from '../shell/SecondaryHeader/SectionsModal';
import { StreakModal } from '../shell/SecondaryHeader/StreakModal';
import { CoinsModal } from '../shell/SecondaryHeader/CoinsModal';
import { RoadmapAside } from '../shell/RoadmapAside';
import { pickDefaultSectionId } from '../shell/SecondaryHeader/sectionStageUtils';

const LessonPreview = dynamic(() => import('./LessonPreview').then((m) => ({ default: m.LessonPreview })), {
  ssr: false,
});
const LessonContentModal = dynamic(
  () => import('./LessonContentModal').then((m) => ({ default: m.LessonContentModal })),
  { ssr: false }
);

import { getAreaInfo } from '@/shared/constants';
import { LoadingState } from '@/shared/components/LoadingState';
import { useLearningPath } from '../hooks/useLearningPath';

/**
 * Ruta de aprendizaje estilo Duolingo:
 * - Móvil: nav secundaria apilada + camino
 * - Escritorio (lg+): columna central (banner + camino) | aside derecho (stats + plantillas)
 */
import type { PathNodeData } from './AreaPath';

function computeSectionProgress(section: { nodes: PathNodeData[] } | undefined) {
  if (!section) {
    return { completedLessons: 0, totalLessons: 0, studyTimeMinutes: 0 };
  }
  const totalLessons = section.nodes.length;
  const completedLessons = section.nodes.filter((n) => n.status === 'completed').length;
  return {
    completedLessons,
    totalLessons,
    studyTimeMinutes: 0,
  };
}

export const LearningRoadmap = ({ initialArea = 'lectura-critica' }: { initialArea?: string }) => {
  const [currentArea, setCurrentArea] = useState(initialArea);
  const [currentSectionId, setCurrentSectionId] = useState<string | undefined>();
  const [selectedLesson, setSelectedLesson] = useState<PathNodeData | null>(null);
  const [viewingLesson, setViewingLesson] = useState<PathNodeData | null>(null);
  const [desktopModal, setDesktopModal] = useState<'areas' | 'streak' | 'coins' | 'sections' | null>(null);

  const { user } = useAuth();
  const demoMode = useUiSessionStore((state) => state.demoMode);
  const streakScope = getStreakScope(user?.uid, demoMode) ?? undefined;
  const { currentStreak = 0, longestStreak = 0, coins = 0, streak = [], loading: statsLoading } = useGamification(streakScope);

  const currentAreaData = getAreaInfo(currentArea);
  const { sections, loading, error } = useLearningPath(currentArea);

  const areaColorClass = currentAreaData?.color ?? 'from-blue-500 to-blue-600';

  const getColorClass = (gradient: string) => {
    if (gradient.includes('blue')) return 'bg-blue-500';
    if (gradient.includes('green')) return 'bg-green-500';
    if (gradient.includes('purple')) return 'bg-purple-500';
    if (gradient.includes('orange')) return 'bg-orange-500';
    if (gradient.includes('pink')) return 'bg-pink-500';
    if (gradient.includes('indigo')) return 'bg-indigo-500';
    return 'bg-slate-500';
  };

  const colorClass = getColorClass(areaColorClass);

  const currentSection = sections.find((s) => s.id === currentSectionId);
  const currentSectionIndex = sections.findIndex((s) => s.id === currentSectionId);

  const activeSections = useMemo(() => {
    if (!currentSectionId) return sections;
    const active = sections.find((s) => s.id === currentSectionId);
    return active ? [active] : sections;
  }, [sections, currentSectionId]);

  const sectionProgress = useMemo(() => computeSectionProgress(currentSection), [currentSection]);

  useEffect(() => {
    setCurrentSectionId(pickDefaultSectionId(sections));
  }, [currentArea, sections]);

  const handleAreaChange = (area: string) => {
    setCurrentArea(area);
    setCurrentSectionId(undefined);
  };

  const handleNodeClick = (node: PathNodeData) => {
    setSelectedLesson(node);
  };

  const handleStartLesson = (lesson?: PathNodeData | { id?: string } | null) => {
    setSelectedLesson(null);
    setViewingLesson(lesson as PathNodeData | null);
  };

  const goToAdjacentSection = (direction: -1 | 1) => {
    if (currentSectionIndex < 0) return;
    const nextSection = sections[currentSectionIndex + direction];
    if (nextSection) setCurrentSectionId(nextSection.id);
  };

  const desktopStreakData = {
    currentStreak,
    longestStreak,
    streakHistory: streak,
    isBadgeUnlocked: currentStreak >= 7,
    daysUntilBadge: Math.max(0, 7 - currentStreak),
  };

  const pathContent = (
    <>
      <LessonAreaLinks roadmapAreaId={currentArea} className="mb-6" />

      {loading && <LoadingState label="Cargando ruta..." layout="section" />}

      {error && <div className="py-10 text-center text-red-400">{error}</div>}

      {!loading && !error && (
        <AreaPath
          areaId={currentArea}
          onNodeClick={handleNodeClick}
          colorClass={colorClass}
          sections={activeSections}
          hideSectionHeader
        />
      )}
    </>
  );

  return (
    <div className={cn('bg-surface relative flex flex-col lg:flex-row', viewingLesson ? 'h-dvh overflow-hidden' : 'min-h-dvh')}>
      {/* Móvil: header secundario apilado */}
      <div className="sticky top-0 z-50 w-full lg:hidden">
        <SecondaryHeader
          currentArea={currentArea}
          onAreaChange={handleAreaChange}
          sections={sections}
          currentSectionId={currentSectionId}
          onSectionChange={setCurrentSectionId}
          areaColorClass={areaColorClass}
        />
      </div>

      {/* Columna central: banner + camino */}
      <div className="relative min-w-0 flex-1">
        {currentSection && sections.length > 0 && (
          <div className="sticky top-0 z-40 hidden px-6 pt-5 lg:block">
            <SectionStageBanner
              section={currentSection}
              areaColorClass={areaColorClass}
              onOpenSections={() => setDesktopModal((m) => (m === 'sections' ? null : 'sections'))}
              onPrevSection={() => goToAdjacentSection(-1)}
              onNextSection={() => goToAdjacentSection(1)}
              hasPrev={currentSectionIndex > 0}
              hasNext={currentSectionIndex < sections.length - 1}
              className="rounded-2xl"
            />
          </div>
        )}

        <div className="relative flex-1 px-0 pt-4 pb-24 lg:px-6 lg:pb-8 lg:pt-6">{pathContent}</div>
      </div>

      {/* Escritorio: aside derecho con stats y plantillas */}
      <RoadmapAside
        currentArea={currentArea}
        currentSection={currentSection}
        sectionProgress={sectionProgress}
        currentStreak={currentStreak}
        coins={coins}
        statsLoading={statsLoading}
        areasOpen={desktopModal === 'areas'}
        onToggleAreas={() => setDesktopModal((m) => (m === 'areas' ? null : 'areas'))}
        onToggleStreak={() => setDesktopModal((m) => (m === 'streak' ? null : 'streak'))}
      />

      {/* Modales compartidos en escritorio (el aside no los monta) */}
      <div className="hidden lg:contents">
        <AreasModal
          isOpen={desktopModal === 'areas'}
          onClose={() => setDesktopModal(null)}
          currentArea={currentArea}
          onSelectArea={(area) => {
            handleAreaChange(area);
            setDesktopModal(null);
          }}
        />

        {currentSectionId && (
          <SectionsModal
            isOpen={desktopModal === 'sections'}
            onClose={() => setDesktopModal(null)}
            currentSectionId={currentSectionId}
            onSelectSection={(id) => {
              setCurrentSectionId(id);
              setDesktopModal(null);
            }}
            sections={sections}
            areaColorClass={areaColorClass}
          />
        )}

        <StreakModal isOpen={desktopModal === 'streak'} onClose={() => setDesktopModal(null)} streakData={desktopStreakData} />

        <CoinsModal isOpen={desktopModal === 'coins'} onClose={() => setDesktopModal(null)} coins={coins} />
      </div>

      <LessonPreview
        isOpen={!!selectedLesson}
        onClose={() => setSelectedLesson(null)}
        lesson={selectedLesson}
        onStart={handleStartLesson}
      />

      <LessonContentModal
        isOpen={!!viewingLesson}
        onClose={() => setViewingLesson(null)}
        lesson={viewingLesson}
        areaId={currentArea}
      />
    </div>
  );
};
