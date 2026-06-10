'use client';

import Link from 'next/link';
import { cn } from '@/utils/cn';
import { getPracticaHrefForRoadmapArea } from '@/shared/constants/practiceAreas';

export interface LessonAreaLinksProps {
  roadmapAreaId: string;
  className?: string;
}

type SubjectTone = 'lc' | 'math' | 'sci' | 'soc' | 'eng' | 'full';

const PRACTICE_BUTTON_STYLES: Record<SubjectTone, { light: string; dark: string }> = {
  lc: {
    light: 'border-blue-600/55 bg-white text-blue-900 shadow-sm hover:border-blue-700 hover:bg-blue-50',
    dark: 'dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-200 dark:hover:border-blue-400/60 dark:hover:bg-blue-500/20 dark:hover:text-white',
  },
  math: {
    light: 'border-green-600/55 bg-white text-green-900 shadow-sm hover:border-green-700 hover:bg-green-50',
    dark: 'dark:border-green-500/40 dark:bg-green-500/10 dark:text-green-200 dark:hover:border-green-400/60 dark:hover:bg-green-500/20 dark:hover:text-white',
  },
  sci: {
    light: 'border-purple-600/55 bg-white text-purple-900 shadow-sm hover:border-purple-700 hover:bg-purple-50',
    dark: 'dark:border-purple-500/40 dark:bg-purple-500/10 dark:text-purple-200 dark:hover:border-purple-400/60 dark:hover:bg-purple-500/20 dark:hover:text-white',
  },
  soc: {
    light: 'border-orange-600/55 bg-white text-orange-950 shadow-sm hover:border-orange-700 hover:bg-orange-50',
    dark: 'dark:border-orange-500/40 dark:bg-orange-500/10 dark:text-orange-200 dark:hover:border-orange-400/60 dark:hover:bg-orange-500/20 dark:hover:text-white',
  },
  eng: {
    light: 'border-indigo-600/55 bg-white text-indigo-900 shadow-sm hover:border-indigo-700 hover:bg-indigo-50',
    dark: 'dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-200 dark:hover:border-indigo-400/60 dark:hover:bg-indigo-500/20 dark:hover:text-white',
  },
  full: {
    light: 'border-pink-600/55 bg-white text-pink-900 shadow-sm hover:border-pink-700 hover:bg-pink-50',
    dark: 'dark:border-pink-500/40 dark:bg-pink-500/10 dark:text-pink-200 dark:hover:border-pink-400/60 dark:hover:bg-pink-500/20 dark:hover:text-white',
  },
};

function subjectToneFromArea(areaId: string): SubjectTone {
  if (areaId.includes('matematic')) return 'math';
  if (areaId.includes('ciencias')) return 'sci';
  if (areaId.includes('sociales')) return 'soc';
  if (areaId.includes('ingles')) return 'eng';
  if (areaId.includes('examen')) return 'full';
  return 'lc';
}

/**
 * Enlaces a `/examen-completo` y práctica (`/practica/[area]`).
 */
export const LessonAreaLinks = ({ roadmapAreaId, className }: LessonAreaLinksProps) => {
  const practicaHref = getPracticaHrefForRoadmapArea(roadmapAreaId);
  const showFullExamLink = roadmapAreaId === 'examen-completo';
  const practiceStyles = PRACTICE_BUTTON_STYLES[subjectToneFromArea(roadmapAreaId)];

  if (!showFullExamLink && !practicaHref) return null;

  return (
    <div className={cn('mx-auto mb-10 max-w-2xl space-y-8 px-4', className)}>
      {showFullExamLink && (
        <div>
          <p className="text-on-surface-muted mb-3 text-center text-xs font-semibold tracking-wider uppercase">
            Simulacro
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/examen-completo"
              className={cn(
                'rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                'border-pink-600/40 bg-pink-100 text-pink-900 hover:border-pink-700 hover:bg-pink-200 hover:text-pink-950',
                'dark:border-pink-500/40 dark:bg-pink-500/10 dark:text-pink-200 dark:hover:border-pink-400/60 dark:hover:bg-pink-500/20 dark:hover:text-white'
              )}
            >
              Ir al examen completo ICFES
            </Link>
          </div>
        </div>
      )}

      {practicaHref && (
        <div>
          <p className="text-on-surface-muted mb-3 text-center text-xs font-semibold tracking-wider uppercase">
            Práctica por área
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href={practicaHref}
              className={cn(
                'rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                practiceStyles.light,
                practiceStyles.dark
              )}
            >
              Modo práctica ICFES
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
