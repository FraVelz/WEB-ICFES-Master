/**
 * ChartContent — simple charts for question bodies
 *
 * Supported kinds: "bar", "line", "pie"
 *
 * Data shape:
 * {
 *   type: "bar",
 *   labels: ["2020", "2021", "2022"],
 *   datasets: [{ label: "Sales", data: [100, 150, 200], color: "bg-cyan-500" }],
 *   title: "Chart title"
 * }
 *
 * For richer charts, consider chart.js + react-chartjs-2.
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
  // Lightweight ASCII-style bars
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
