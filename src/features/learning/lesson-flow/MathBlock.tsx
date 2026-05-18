'use client';

import { BlockMath, InlineMath } from 'react-katex';

type MathBlockProps = {
  latex: string;
  display?: boolean;
};

/**
 * KaTeX centrado (display) o en línea.
 */
export function MathBlock({ latex, display = true }: MathBlockProps) {
  if (!latex?.trim()) return null;

  if (display) {
    return (
      <div className="my-6 flex justify-center overflow-x-auto px-1">
        <div className="max-w-full [&_.katex]:text-lg [&_.katex-display]:my-0">
          <BlockMath
            math={latex}
            renderError={(err: Error) => (
              <span className="text-sm text-rose-400">No se pudo renderizar la fórmula: {err.message}</span>
            )}
          />
        </div>
      </div>
    );
  }

  return (
    <span className="inline [&_.katex]:text-base">
      <InlineMath math={latex} renderError={(err: Error) => <span className="text-rose-400">({err.message})</span>} />
    </span>
  );
}
