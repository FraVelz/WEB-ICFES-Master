'use client';

import Link from 'next/link';
import { cn } from '@/utils/cn';
import { getLessonRoutesForRoadmapArea } from '@/features/learning/constants/lessonDynamicRoutes';
import { getPracticaHrefForRoadmapArea } from '@/features/learning/constants/practiceDynamicRoutes';

function formatTopicLabel(slug: string) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export interface LessonAreaLinksProps {
  roadmapAreaId: string;
  className?: string;
}

/**
 * Enlaces a `/examen-completo`, práctica (`/practica/[area]`) y lecciones (`/lessons/[area]/[topic]`).
 */
export const LessonAreaLinks = ({ roadmapAreaId, className }: LessonAreaLinksProps) => {
  const practicaHref = getPracticaHrefForRoadmapArea(roadmapAreaId);
  const lessonRoutes = getLessonRoutesForRoadmapArea(roadmapAreaId);
  const showFullExamLink = roadmapAreaId === 'examen-completo';

  if (!showFullExamLink && !practicaHref && lessonRoutes.length === 0) return null;

  return (
    <div className={cn('mx-auto mb-10 max-w-2xl space-y-8 px-4', className)}>
      {showFullExamLink && (
        <div>
          <p className="mb-3 text-center text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Simulacro
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/examen-completo"
              className={cn(
                'rounded-full border border-pink-500/40 bg-pink-500/10 px-4 py-2 text-sm font-semibold text-pink-200',
                'transition-colors hover:border-pink-400/60 hover:bg-pink-500/20 hover:text-white'
              )}
            >
              Ir al examen completo ICFES
            </Link>
          </div>
        </div>
      )}

      {practicaHref && (
        <div>
          <p className="mb-3 text-center text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Práctica por área
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href={practicaHref}
              className={cn(
                'rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-200',
                'transition-colors hover:border-amber-400/60 hover:bg-amber-500/20 hover:text-white'
              )}
            >
              Modo práctica ICFES
            </Link>
          </div>
        </div>
      )}

      {lessonRoutes.length > 0 && (
        <div>
          <p className="mb-3 text-center text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Lecciones interactivas por tema
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {lessonRoutes.map(({ href, topic }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'rounded-full border border-slate-600/80 bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-200',
                  'transition-colors hover:border-cyan-500/50 hover:bg-slate-700/80 hover:text-white'
                )}
              >
                {formatTopicLabel(topic)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
