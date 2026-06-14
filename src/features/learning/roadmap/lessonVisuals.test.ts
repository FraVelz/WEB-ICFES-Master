import { describe, expect, it } from 'vitest';
import { parseLessonVisuals } from './lessonVisualTypes';
import { prepareLessonBody } from './lessonMarkdownUtils';
import { splitContentWithVisuals } from './lessonContentSegments';

describe('lesson visuals pipeline', () => {
  it('parses chart and table visuals', () => {
    const visuals = parseLessonVisuals([
      {
        type: 'chart',
        chartType: 'bar',
        title: 'Ventas',
        labels: ['Ene', 'Feb'],
        series: [{ name: 'Miles', values: [10, 20] }],
      },
      {
        type: 'table',
        title: 'Datos',
        headers: ['A', 'B'],
        rows: [['1', '2']],
      },
    ]);

    expect(visuals).toHaveLength(2);
    expect(visuals[0]?.type).toBe('chart');
    expect(visuals[1]?.type).toBe('table');
  });

  it('converts chart-json blocks into visual shortcodes', () => {
    const input = 'Intro\n\n```chart-json\n{"chartType":"line","labels":["1","2"],"series":[{"name":"y","values":[3,4]}]}\n```\n\nFin';
    const prepared = prepareLessonBody(input, []);
    expect(prepared.content).toContain('{{visual:0}}');
    expect(prepared.visuals).toHaveLength(1);
  });

  it('splits markdown around visual shortcodes', () => {
    const segments = splitContentWithVisuals('Parte A\n\n{{visual:0}}\n\nParte B');
    expect(segments).toEqual([
      { type: 'markdown', content: 'Parte A' },
      { type: 'visual', index: 0 },
      { type: 'markdown', content: 'Parte B' },
    ]);
  });
});
