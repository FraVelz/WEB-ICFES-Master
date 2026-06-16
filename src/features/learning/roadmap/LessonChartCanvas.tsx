'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { cn } from '@/utils/cn';
import type { LessonChartVisual } from './lessonVisualTypes';

const PIE_COLORS = ['#22d3ee', '#38bdf8', '#818cf8', '#a78bfa', '#f472b6', '#fb923c'];

export type LessonChartCanvasProps = {
  visual: LessonChartVisual;
  className?: string;
};

function toChartRows(visual: LessonChartVisual) {
  return visual.labels.map((label, index) => {
    const row: Record<string, string | number> = { label };
    for (const serie of visual.series) {
      row[serie.name] = serie.values[index] ?? 0;
    }
    return row;
  });
}

export function LessonChartCanvas({ visual, className }: LessonChartCanvasProps) {
  const rows = toChartRows(visual);
  const seriesKeys = visual.series.map((serie) => serie.name);

  return (
    <figure
      className={cn(
        'border-surface-border bg-surface-overlay/40 my-4 overflow-hidden rounded-xl border p-3 sm:my-5 sm:p-4',
        className
      )}
      aria-label={visual.title ?? 'Gráfica de la lección'}
    >
      {visual.title ? (
        <figcaption className="text-on-surface mb-3 text-sm font-semibold sm:text-base">{visual.title}</figcaption>
      ) : null}

      <div className="h-56 w-full min-w-0 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          {visual.chartType === 'line' ? (
            <LineChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
              <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Legend />
              {seriesKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={PIE_COLORS[index % PIE_COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              ))}
            </LineChart>
          ) : visual.chartType === 'pie' ? (
            <PieChart>
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Pie
                data={rows.map((row, index) => ({
                  name: String(row.label),
                  value: Number(row[seriesKeys[0]] ?? 0),
                  fill: PIE_COLORS[index % PIE_COLORS.length],
                }))}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="78%"
                label
              >
                {rows.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          ) : (
            <BarChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
              <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Legend />
              {seriesKeys.map((key, index) => (
                <Bar key={key} dataKey={key} fill={PIE_COLORS[index % PIE_COLORS.length]} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </figure>
  );
}
