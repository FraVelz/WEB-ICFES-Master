import type { LessonVisual } from './lessonVisualTypes';
import { parseLessonVisuals } from './lessonVisualTypes';

const CHART_JSON_BLOCK_RE = /```chart-json\s*([\s\S]*?)```/g;

export function prepareLessonBody(content: string, visuals: LessonVisual[] = []): { content: string; visuals: LessonVisual[] } {
  const mergedVisuals = [...visuals];

  const preparedContent = content.replace(CHART_JSON_BLOCK_RE, (_, jsonRaw: string) => {
    try {
      const parsed = JSON.parse(jsonRaw.trim()) as Record<string, unknown>;
      const chartVisual = parseLessonVisuals([{ type: 'chart', ...parsed }])[0];
      if (!chartVisual) return '';
      const index = mergedVisuals.length;
      mergedVisuals.push(chartVisual);
      return `{{visual:${index}}}`;
    } catch {
      return '';
    }
  });

  return { content: preparedContent, visuals: mergedVisuals };
}
