/**
 * FormulaContent - Componente para mostrar fórmulas matemáticas
 * 
 * Usa notación LaTeX para las matemáticas.
 * Para fórmulas inline: $formula$
 * Para fórmulas en bloque: $$formula$$
 * 
 * Uso:
 * <FormulaContent formula="x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}" />
 * <FormulaContent formula="E = mc^2" inline={true} />
 * 
 * Nota: Para usar este componente completo se requiere instalar:
 * npm install katex react-katex
 * 
 * Por ahora proporciona estructura básica para implementación futura
 */
export const FormulaContent = ({ formula, inline = false, description = "" }) => {
  return (
    <div className="my-6 p-4 bg-linear-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
      <div className="font-mono text-center">
        <code className={`${inline ? 'text-sm' : 'text-lg block py-2'} text-purple-300`}>
          {inline ? `$${formula}$` : `$$${formula}$$`}
        </code>
      </div>
      {description && (
        <p className="text-xs text-gray-400 mt-3 text-center italic">
          {description}
        </p>
      )}
      <p className="text-xs text-gray-500 mt-2 text-center">
        ⚠️ Fórmula en notación LaTeX (requiere renderer)
      </p>
    </div>
  );
};
