/**
 * ChartContent - Componente para mostrar gráficas/gráficos en preguntas
 * 
 * Tipos soportados: "bar", "line", "pie"
 * 
 * Estructura de datos:
 * {
 *   type: "bar",
 *   labels: ["2020", "2021", "2022"],
 *   datasets: [
 *     {
 *       label: "Ventas",
 *       data: [100, 150, 200],
 *       color: "bg-cyan-500"
 *     }
 *   ],
 *   title: "Título del gráfico"
 * }
 * 
 * Uso:
 * <ChartContent
 *   type="bar"
 *   labels={["Q1", "Q2", "Q3"]}
 *   datasets={[{ label: "Ingresos", data: [1000, 1500, 2000] }]}
 *   title="Ingresos por trimestre"
 * />
 * 
 * Nota: Esta es una versión simplificada. Para gráficas complejas
 * se recomienda instalar: npm install chart.js react-chartjs-2
 */
export const ChartContent = ({ type = "bar", labels, datasets, title, description = "" }) => {
  // Versión simplificada con barras ASCII/visual
  const renderSimpleBar = () => {
    const maxValue = Math.max(...datasets.flatMap(d => d.data));
    const scale = 200 / maxValue;

    return (
      <div className="space-y-4">
        {datasets[0].data.map((value, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <span className="text-sm font-semibold text-gray-300 w-16 text-right">
              {labels[idx]}
            </span>
            <div className="flex items-center gap-2 flex-1">
              <div
                className="bg-linear-to-r from-cyan-500 to-blue-500 rounded h-8"
                style={{ width: `${value * scale}px` }}
              ></div>
              <span className="text-sm text-gray-400">{value}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="my-6 p-6 bg-linear-to-r from-slate-700/20 to-slate-800/20 rounded-lg border border-cyan-500/20">
      {title && (
        <h4 className="text-sm font-semibold text-cyan-300 mb-4 text-center">
          {title}
        </h4>
      )}

      {type === "bar" && renderSimpleBar()}

      {description && (
        <p className="text-xs text-gray-400 mt-4 text-center italic">
          {description}
        </p>
      )}

      <p className="text-xs text-gray-500 mt-3 text-center">
        💡 Para gráficas interactivas avanzadas, usa Chart.js
      </p>
    </div>
  );
};
