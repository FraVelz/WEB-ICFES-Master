'use client';

import Link from 'next/link';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { getLearningPhasesHref, getRoadmapHref } from '@/features/learning/data/competencyPhases';
import { SectionStageBanner } from '@/features/learning/shell/SecondaryHeader/SectionStageBanner';
import { useDashboardShell } from './DashboardShellContext';
import { SHELL_SECTION_META } from './shellRoutes';

type NavSectionBannerProps = {
  title: string;
  subtitle: string;
  gradient: string;
  icon: string;
  href?: string;
  className?: string;
};

function NavSectionBanner({ title, subtitle, gradient, icon, href, className }: NavSectionBannerProps) {
  const inner = (
    <>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
        <Icon name={icon} className="text-lg text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold tracking-wider text-white/80 uppercase">{subtitle}</p>
        <p className="truncate text-base font-bold text-white sm:text-lg">{title}</p>
      </div>
    </>
  );

  return (
    <div className={cn('bg-linear-to-r px-4 py-3 shadow-md', gradient, className)}>
      <div className="mx-auto flex w-full max-w-xl items-center gap-3">
        {href ? (
          <Link
            href={href}
            className={cn(
              'flex min-w-0 flex-1 items-center gap-3 rounded-xl px-1 py-0.5 transition-colors',
              'hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none'
            )}
          >
            {inner}
          </Link>
        ) : (
          <div className="flex min-w-0 flex-1 items-center gap-3">{inner}</div>
        )}
      </div>
    </div>
  );
}

export function DashboardShellBanner({ className }: { className?: string }) {
  const {
    shellSection,
    isPhasesRoute,
    currentArea,
    currentSection,
    currentSectionId,
    currentSectionIndex,
    sections,
    currentAreaData,
    goToAdjacentSection,
  } = useDashboardShell();

  if (shellSection === 'learning' && isPhasesRoute) {
    const backHref = getRoadmapHref(currentSectionId, currentArea);
    return (
      <NavSectionBanner
        title="Fases del recorrido"
        subtitle={currentAreaData.name}
        gradient={currentAreaData.color ?? 'from-blue-600 to-indigo-700'}
        icon="book-open"
        href={backHref}
        className={className}
      />
    );
  }

  if (shellSection === 'learning' && currentSection && sections.length > 0) {
    return (
      <SectionStageBanner
        section={currentSection}
        areaColorClass={currentAreaData.color ?? 'from-blue-500 to-blue-600'}
        guideHref={getLearningPhasesHref(currentArea)}
        onPrevSection={() => goToAdjacentSection(-1)}
        onNextSection={() => goToAdjacentSection(1)}
        hasPrev={currentSectionIndex > 0}
        hasNext={currentSectionIndex < sections.length - 1}
        className={className}
      />
    );
  }

  const meta = SHELL_SECTION_META[shellSection];
  return (
    <NavSectionBanner
      title={meta.title}
      subtitle={meta.subtitle}
      gradient={meta.gradient}
      icon={meta.icon}
      className={className}
    />
  );
}
