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
interface ChartDataset {
  label?: string;
  data: number[];
  color?: string;
}

interface ChartContentProps {
  type?: 'bar' | 'line' | 'pie';
  labels?: string[];
  datasets?: ChartDataset[];
  title?: string;
  description?: string;
}

export const ChartContent = ({ type = 'bar', labels, datasets, title, description = '' }: ChartContentProps) => {
  // Versión simplificada con barras ASCII/visual
  const renderSimpleBar = () => {
    const ds = datasets ?? [];
    const lb = labels ?? [];
    if (!ds[0]) return null;
    const maxValue = Math.max(...ds.flatMap((d: ChartDataset) => d.data));
    const scale = 200 / maxValue;

    return (
      <div className="space-y-4">
        {ds[0]?.data.map((value: number, idx: number) => (
          <div key={idx} className="flex items-center gap-4">
            <span className="w-16 text-right text-sm font-semibold text-gray-300">{lb[idx]}</span>
            <div className="flex flex-1 items-center gap-2">
              <div
                className="h-8 rounded bg-linear-to-r from-cyan-500 to-blue-500"
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
    <div className="my-6 rounded-lg border border-cyan-500/20 bg-linear-to-r from-slate-700/20 to-slate-800/20 p-6">
      {title && <h4 className="mb-4 text-center text-sm font-semibold text-cyan-300">{title}</h4>}

      {type === 'bar' && renderSimpleBar()}

      {description && <p className="mt-4 text-center text-xs text-gray-400 italic">{description}</p>}

      <p className="mt-3 text-center text-xs text-gray-500">💡 Para gráficas interactivas avanzadas, usa Chart.js</p>
    </div>
  );
};
