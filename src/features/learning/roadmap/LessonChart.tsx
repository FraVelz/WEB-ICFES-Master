'use client';

import dynamic from 'next/dynamic';
import { cn } from '@/utils/cn';
import type { LessonChartVisual } from './lessonVisualTypes';

const chartFallback = (
  <div
    className={cn(
      'border-surface-border bg-surface-overlay/40 my-4 h-56 animate-pulse rounded-xl border',
      'motion-reduce:animate-none sm:my-5 sm:h-64'
    )}
    aria-hidden
  />
);

const LessonChartCanvas = dynamic(
  () => import('./LessonChartCanvas').then((mod) => ({ default: mod.LessonChartCanvas })),
  { loading: () => chartFallback, ssr: false }
);

type LessonChartProps = {
  visual: LessonChartVisual;
  className?: string;
};

export function LessonChart({ visual, className }: LessonChartProps) {
  return <LessonChartCanvas visual={visual} className={className} />;
}
