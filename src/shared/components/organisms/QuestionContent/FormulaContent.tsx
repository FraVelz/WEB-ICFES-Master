import { cn } from '@/utils/cn';

/**
 * FormulaContent — math (LaTeX) placeholder
 * Inline: $...$ ; block: $$...$$
 * Full rendering needs katex + react-katex (see package.json when wired).
 */
interface FormulaContentProps {
  formula?: string;
  inline?: boolean;
  description?: string;
}

export const FormulaContent = ({ formula, inline = false, description = '' }: FormulaContentProps) => {
  return (
    <div className="my-6 rounded-lg border border-purple-500/20 bg-linear-to-r from-purple-500/10 to-blue-500/10 p-4">
      <div className="text-center font-mono">
        <code className={cn(inline ? 'text-sm' : 'block py-2 text-lg', 'text-purple-300')}>
          {inline ? `$${formula ?? ''}$` : `$$${formula ?? ''}$$`}
        </code>
      </div>
      {description && <p className="mt-3 text-center text-xs text-gray-400 italic">{description}</p>}
      <p className="mt-2 text-center text-xs text-gray-500">⚠️ Fórmula en notación LaTeX (requiere renderer)</p>
    </div>
  );
};
