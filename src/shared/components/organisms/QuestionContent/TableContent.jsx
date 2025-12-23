/**
 * TableContent - Componente para mostrar tablas en las preguntas
 * 
 * Estructura de datos:
 * {
 *   headers: ["Encabezado 1", "Encabezado 2"],
 *   rows: [
 *     ["Celda 1", "Celda 2"],
 *     ["Celda 3", "Celda 4"]
 *   ],
 *   caption: "Pie de tabla (opcional)"
 * }
 * 
 * Uso:
 * <TableContent
 *   headers={["País", "Población"]}
 *   rows={[["Colombia", "50M"], ["México", "128M"]]}
 *   caption="Población de países latinoamericanos"
 * />
 */
export const TableContent = ({ headers, rows, caption }) => {
  return (
    <figure className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-linear-to-r from-cyan-500/20 to-blue-500/20 border-b border-white/20">
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-4 py-3 text-left font-semibold text-cyan-300 border-r border-white/10 last:border-r-0"
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
              className={`border-b border-white/10 ${
                rowIdx % 2 === 0 ? 'bg-white/5' : 'bg-white/2'
              } hover:bg-white/10 transition-colors`}
            >
              {row.map((cell, cellIdx) => (
                <td
                  key={cellIdx}
                  className="px-4 py-3 text-gray-200 border-r border-white/10 last:border-r-0"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {caption && (
        <figcaption className="mt-3 text-xs text-gray-400 italic text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
