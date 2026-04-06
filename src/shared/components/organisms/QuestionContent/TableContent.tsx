/**
 * TableContent — markdown-style tables in questions
 *
 * Shape: { headers, rows, caption? }
 */
import { cn } from '@/utils/cn';

interface TableContentProps {
  headers?: string[];
  rows?: unknown[][];
  caption?: string;
}

export const TableContent = ({ headers = [], rows = [], caption }: TableContentProps) => {
  return (
    <figure className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-white/20 bg-linear-to-r from-cyan-500/20 to-blue-500/20">
            {headers.map((header: string, idx: number) => (
              <th
                key={idx}
                className="border-r border-white/10 px-4 py-3 text-left font-semibold text-cyan-300 last:border-r-0"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className={cn(
                'border-b border-white/10 transition-colors hover:bg-white/10',
                rowIdx % 2 === 0 ? 'bg-white/5' : 'bg-white/2'
              )}
            >
              {row.map((cell: unknown, cellIdx: number) => (
                <td key={cellIdx} className="border-r border-white/10 px-4 py-3 text-gray-200 last:border-r-0">
                  {String(cell ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {caption && <figcaption className="mt-3 text-center text-xs text-gray-400 italic">{caption}</figcaption>}
    </figure>
  );
};
