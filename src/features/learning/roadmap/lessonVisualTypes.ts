export type LessonChartSeries = {
  name: string;
  values: number[];
};

export type LessonChartVisual = {
  type: 'chart';
  chartType: 'bar' | 'line' | 'pie';
  title?: string;
  labels: string[];
  series: LessonChartSeries[];
};

export type LessonTableVisual = {
  type: 'table';
  title?: string;
  headers: string[];
  rows: string[][];
};

export type LessonVisual = LessonChartVisual | LessonTableVisual;

export function parseLessonVisuals(value: unknown): LessonVisual[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((entry) => {
      if (!entry || typeof entry !== 'object') return null;
      const visual = entry as Record<string, unknown>;

      if (visual.type === 'table') {
        const headers = Array.isArray(visual.headers) ? visual.headers.map(String) : [];
        const rows = Array.isArray(visual.rows)
          ? visual.rows
              .filter((row): row is unknown[] => Array.isArray(row))
              .map((row) => row.map(String))
          : [];
        if (headers.length === 0) return null;
        return {
          type: 'table',
          title: typeof visual.title === 'string' ? visual.title : undefined,
          headers,
          rows,
        } satisfies LessonTableVisual;
      }

      if (visual.type === 'chart') {
        const labels = Array.isArray(visual.labels) ? visual.labels.map(String) : [];
        const chartType = visual.chartType === 'line' || visual.chartType === 'pie' ? visual.chartType : 'bar';
        const series = Array.isArray(visual.series)
          ? visual.series
              .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
              .map((item) => ({
                name: String(item.name ?? 'Serie'),
                values: Array.isArray(item.values) ? item.values.map((v) => Number(v) || 0) : [],
              }))
          : [];
        if (labels.length === 0 || series.length === 0) return null;
        return {
          type: 'chart',
          chartType,
          title: typeof visual.title === 'string' ? visual.title : undefined,
          labels,
          series,
        } satisfies LessonChartVisual;
      }

      return null;
    })
    .filter((visual): visual is LessonVisual => visual != null);
}
