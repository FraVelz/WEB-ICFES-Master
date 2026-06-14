'use client';

import { LessonChart } from './LessonChart';
import { LessonMarkdownBody } from './LessonMarkdownBody';
import { resolveVisualAtIndex, splitContentWithVisuals } from './lessonContentSegments';
import type { LessonVisual } from './lessonVisualTypes';

type LessonRichContentProps = {
  content: string;
  visuals?: LessonVisual[];
};

function LessonTableVisual({ visual }: { visual: Extract<LessonVisual, { type: 'table' }> }) {
  return (
    <figure
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
}

export function LessonRichContent({ content, visuals }: LessonRichContentProps) {
  const segments = splitContentWithVisuals(content);

  return (
    <div className="space-y-2">
      {segments.map((segment, index) => {
        if (segment.type === 'markdown') {
          return <LessonMarkdownBody key={`md-${index}`} content={segment.content} />;
        }

        const visual = resolveVisualAtIndex(visuals, segment.index);
        if (!visual) return null;

        if (visual.type === 'chart') {
          return <LessonChart key={`visual-${index}`} visual={visual} />;
        }

        return <LessonTableVisual key={`visual-${index}`} visual={visual} />;
      })}
    </div>
  );
}
