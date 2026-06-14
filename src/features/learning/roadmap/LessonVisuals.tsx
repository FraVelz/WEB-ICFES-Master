'use client';

import { cn } from '@/utils/cn';
import { LessonChart } from './LessonChart';
import type { LessonVisual } from './lessonVisualTypes';

type LessonVisualsProps = {
  visuals?: LessonVisual[];
  className?: string;
};

export function LessonVisuals({ visuals, className }: LessonVisualsProps) {
  if (!visuals || visuals.length === 0) return null;

  return (
    <div className={cn('space-y-4', className)}>
      {visuals.map((visual, index) => {
        if (visual.type === 'chart') {
          return <LessonChart key={`chart-${index}`} visual={visual} />;
        }

        return (
          <figure
            key={`table-${index}`}
            className="border-surface-border bg-surface-overlay/40 my-4 overflow-x-auto rounded-xl border sm:my-5"
            aria-label={visual.title ?? 'Tabla de la lección'}
          >
            {visual.title ? (
              <figcaption className="text-on-surface border-surface-border border-b px-3 py-2 text-sm font-semibold sm:px-4 sm:text-base">
                {visual.title}
              </figcaption>
            ) : null}
            <table className="lesson-table w-full min-w-[280px] text-left text-sm">
              <thead>
                <tr>
                  {visual.headers.map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visual.rows.map((row, rowIndex) => (
                  <tr key={`row-${rowIndex}`}>
                    {row.map((cell, cellIndex) => (
                      <td key={`cell-${rowIndex}-${cellIndex}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </figure>
        );
      })}
    </div>
  );
}
