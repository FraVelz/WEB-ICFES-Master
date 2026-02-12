/**
 * CodeContent - Componente para mostrar código/pseudocódigo en preguntas
 * 
 * Lenguajes soportados: "javascript", "python", "java", "pseudocode", "sql", etc.
 * 
 * Uso:
 * <CodeContent
 *   language="python"
 *   code={`for i in range(10):
 *     print(i)`}
 *   title="Ejemplo de bucle"
 * />
 */
export const CodeContent = ({ language = "pseudocode", code, title, showLineNumbers = true }) => {
  const lines = code.split('\n');

  return (
    <div className="my-6 rounded-lg overflow-hidden border border-green-500/20">
      {title && (
        <div className="bg-linear-to-r from-green-500/20 to-emerald-500/20 px-4 py-2 border-b border-green-500/20">
          <p className="text-xs font-semibold text-green-300">{language.toUpperCase()}</p>
          <p className="text-xs text-gray-300 mt-1">{title}</p>
        </div>
      )}

      <pre className="bg-slate-950/80 p-4 overflow-x-auto">
        <code className="text-xs font-mono text-gray-200 space-y-1 flex">
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
            {lines.map((line, idx) => (
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
