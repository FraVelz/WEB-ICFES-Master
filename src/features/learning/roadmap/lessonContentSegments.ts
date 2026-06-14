import type { LessonVisual } from './lessonVisualTypes';

export type LessonContentSegment = { type: 'markdown'; content: string } | { type: 'visual'; index: number };

const VISUAL_SHORTCODE_RE = /\{\{visual:(\d+)\}\}/g;

export function splitContentWithVisuals(content: string): LessonContentSegment[] {
  const segments: LessonContentSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  const regex = new RegExp(VISUAL_SHORTCODE_RE.source, 'g');
  while ((match = regex.exec(content)) !== null) {
    const before = content.slice(lastIndex, match.index).trim();
    if (before) segments.push({ type: 'markdown', content: before });

    const visualIndex = Number.parseInt(match[1], 10);
    if (Number.isFinite(visualIndex)) {
      segments.push({ type: 'visual', index: visualIndex });
    }

    lastIndex = match.index + match[0].length;
  }

  const tail = content.slice(lastIndex).trim();
  if (tail) segments.push({ type: 'markdown', content: tail });

  if (segments.length === 0 && content.trim()) {
    segments.push({ type: 'markdown', content });
  }

  return segments;
}

export function resolveVisualAtIndex(visuals: LessonVisual[] | undefined, index: number): LessonVisual | null {
  if (!visuals || index < 0 || index >= visuals.length) return null;
  return visuals[index] ?? null;
}
