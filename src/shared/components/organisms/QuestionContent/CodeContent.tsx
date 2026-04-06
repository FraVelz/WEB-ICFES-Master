/**
 * CodeContent — code / pseudocode blocks in questions
 *
 * `language` is cosmetic (syntax highlight not implemented here).
 */
interface CodeContentProps {
  language?: string;
  code?: string;
  title?: string;
  showLineNumbers?: boolean;
}

export const CodeContent = ({ language = 'pseudocode', code, title, showLineNumbers = true }: CodeContentProps) => {
  const lines = (code ?? '').split('\n');

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-green-500/20">
      {title && (
        <div className="border-b border-green-500/20 bg-linear-to-r from-green-500/20 to-emerald-500/20 px-4 py-2">
          <p className="text-xs font-semibold text-green-300">{language.toUpperCase()}</p>
          <p className="mt-1 text-xs text-gray-300">{title}</p>
        </div>
      )}

      <pre className="overflow-x-auto bg-slate-950/80 p-4">
        <code className="flex space-y-1 font-mono text-xs text-gray-200">
          {showLineNumbers && (
            <span className="mr-4 text-gray-600 select-none">
              {lines.map((_, idx) => (
                <span key={idx}>
                  {String(idx + 1).padStart(2, '0')}
                  {'\n'}
                </span>
              ))}
            </span>
          )}
          <span className="flex-1">
            {lines.map((line: string, idx: number) => (
              <span key={idx}>
                {line}
                {'\n'}
              </span>
            ))}
          </span>
        </code>
      </pre>
    </div>
  );
};
