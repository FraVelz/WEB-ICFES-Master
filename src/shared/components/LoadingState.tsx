'use client';

import { cn } from '@/utils/cn';
import { Icon } from './Icon';

export type LoadingStateLayout = 'page' | 'fill' | 'section';

export interface LoadingStateProps {
  label?: string;
  layout?: LoadingStateLayout;
  className?: string;
}

const layoutClasses: Record<LoadingStateLayout, string> = {
  page: 'flex min-h-dvh w-full items-center justify-center bg-slate-950',
  fill: 'flex min-h-full w-full flex-1 items-center justify-center self-stretch',
  section: 'flex min-h-[min(50vh,20rem)] w-full items-center justify-center py-12',
};

export function LoadingState({ label = 'Cargando...', layout = 'section', className }: LoadingStateProps) {
  return (
    <div className={cn(layoutClasses[layout], className)} role="status" aria-live="polite" aria-busy="true">
      <div className="flex flex-col items-center gap-4 text-center">
        <Icon name="spinner" size="2xl" className="text-app-accent animate-spin" aria-hidden />
        <p className="text-slate-300">{label}</p>
      </div>
    </div>
  );
}
