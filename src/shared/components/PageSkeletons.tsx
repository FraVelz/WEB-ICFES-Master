import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

type SkeletonLayout = 'section' | 'page';

type SkeletonShellProps = {
  layout?: SkeletonLayout;
  label: string;
  className?: string;
  children: ReactNode;
};

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn('bg-surface-border animate-pulse rounded motion-reduce:animate-none', className)}
      aria-hidden="true"
    />
  );
}

function SkeletonShell({ layout = 'section', label, className, children }: SkeletonShellProps) {
  return (
    <div
      className={cn(
        layout === 'page' ? 'bg-surface min-h-dvh w-full px-4 py-6 sm:px-6' : 'w-full py-4 sm:py-6',
        className
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
    >
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

export function ExamPageSkeleton({
  layout = 'section',
  questionCount = 3,
  className,
}: {
  layout?: SkeletonLayout;
  questionCount?: number;
  className?: string;
}) {
  return (
    <SkeletonShell layout={layout} label="Cargando examen" className={className}>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="border-surface-border bg-surface-elevated/80 rounded-xl border p-4 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2">
              <SkeletonBlock className="h-6 w-28" />
              <SkeletonBlock className="h-4 w-40" />
            </div>
            <SkeletonBlock className="hidden h-9 w-20 sm:block" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
          <div className="space-y-4 xl:col-span-3">
            {Array.from({ length: questionCount }, (_, index) => (
              <div
                key={index}
                className="border-surface-border bg-surface-elevated/80 space-y-4 rounded-xl border p-4 sm:p-6"
              >
                <div className="flex items-start gap-3">
                  <SkeletonBlock className="h-10 w-10 shrink-0 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <SkeletonBlock className="h-4 w-24" />
                    <SkeletonBlock className="h-4 w-full" />
                    <SkeletonBlock className="h-4 w-5/6" />
                  </div>
                </div>
                <div className="ml-12 space-y-2">
                  {Array.from({ length: 4 }, (_, optionIndex) => (
                    <SkeletonBlock key={optionIndex} className="h-11 w-full rounded-lg" />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="hidden xl:block">
            <div className="border-surface-border bg-surface-elevated/90 space-y-4 rounded-xl border p-4">
              <SkeletonBlock className="h-4 w-36" />
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: Math.min(questionCount, 10) }, (_, index) => (
                  <SkeletonBlock key={index} className="aspect-square rounded-lg" />
                ))}
              </div>
              <div className="space-y-2">
                <SkeletonBlock className="h-3 w-24" />
                <SkeletonBlock className="h-3 w-28" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SkeletonShell>
  );
}

export function RoadmapPageSkeleton({
  layout = 'section',
  className,
}: {
  layout?: SkeletonLayout;
  className?: string;
}) {
  return (
    <SkeletonShell layout={layout} label="Cargando ruta de aprendizaje" className={className}>
      <div className="mx-auto max-w-3xl space-y-8 px-2">
        <div className="space-y-2 text-center">
          <SkeletonBlock className="mx-auto h-6 w-48" />
          <SkeletonBlock className="mx-auto h-4 w-64" />
        </div>

        {Array.from({ length: 2 }, (_, sectionIndex) => (
          <div key={sectionIndex} className="space-y-4">
            <SkeletonBlock className="mx-auto h-5 w-40" />
            <div className="relative space-y-6 pl-8">
              <div className="bg-surface-border absolute top-2 bottom-2 left-[1.125rem] w-0.5 animate-pulse motion-reduce:animate-none" />
              {Array.from({ length: 5 }, (_, nodeIndex) => (
                <div key={nodeIndex} className="flex items-center gap-4">
                  <SkeletonBlock className="h-9 w-9 shrink-0 rounded-full" />
                  <div className="border-surface-border bg-surface-elevated/70 flex-1 space-y-2 rounded-2xl border p-4">
                    <SkeletonBlock className="h-4 w-2/3" />
                    <SkeletonBlock className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SkeletonShell>
  );
}

export function PhasesPageSkeleton({ layout = 'section', className }: { layout?: SkeletonLayout; className?: string }) {
  return (
    <SkeletonShell layout={layout} label="Cargando fases" className={className}>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-3">
          <SkeletonBlock className="h-8 w-56" />
          <SkeletonBlock className="h-4 w-full max-w-xl" />
          <SkeletonBlock className="h-4 w-44" />
        </div>

        <ul className="space-y-3">
          {Array.from({ length: 3 }, (_, index) => (
            <li key={index}>
              <div className="border-surface-border bg-surface-elevated/80 space-y-4 rounded-2xl border p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <SkeletonBlock className="h-5 w-40" />
                    <SkeletonBlock className="h-4 w-56" />
                  </div>
                  <SkeletonBlock className="h-8 w-20 rounded-full" />
                </div>
                <SkeletonBlock className="h-2 w-full rounded-full" />
                <SkeletonBlock className="h-10 w-full rounded-xl" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </SkeletonShell>
  );
}

export function LessonPageSkeleton({ layout = 'section', className }: { layout?: SkeletonLayout; className?: string }) {
  return (
    <SkeletonShell layout={layout} label="Cargando lección" className={className}>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex gap-2">
          <SkeletonBlock className="h-4 w-20" />
          <SkeletonBlock className="h-4 w-24" />
        </div>

        <div className="space-y-3">
          <SkeletonBlock className="h-8 w-3/4 max-w-md" />
          <SkeletonBlock className="h-2 w-full rounded-full" />
        </div>

        <div className="border-surface-border bg-surface-elevated/80 space-y-4 rounded-2xl border p-6">
          {Array.from({ length: 5 }, (_, index) => (
            <SkeletonBlock key={index} className={cn('h-4', index === 4 ? 'w-2/3' : 'w-full')} />
          ))}
          <SkeletonBlock className="mt-4 h-40 w-full rounded-xl" />
        </div>

        <div className="flex justify-between gap-3">
          <SkeletonBlock className="h-10 w-28 rounded-xl" />
          <SkeletonBlock className="h-10 w-32 rounded-xl" />
        </div>
      </div>
    </SkeletonShell>
  );
}

export function DashboardPageSkeleton({ className }: { className?: string }) {
  return (
    <SkeletonShell layout="page" label="Cargando panel" className={className}>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row">
        <div className="hidden w-56 shrink-0 space-y-3 lg:block">
          {Array.from({ length: 6 }, (_, index) => (
            <SkeletonBlock key={index} className="h-10 w-full rounded-xl" />
          ))}
        </div>
        <div className="min-w-0 flex-1 space-y-6">
          <SkeletonBlock className="h-10 w-48" />
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="border-surface-border bg-surface-elevated/70 space-y-3 rounded-2xl border p-4"
              >
                <SkeletonBlock className="h-24 rounded-xl" />
                <SkeletonBlock className="h-4 w-3/4" />
                <SkeletonBlock className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </SkeletonShell>
  );
}

export function LeaguePageSkeleton({ className }: { className?: string }) {
  return (
    <SkeletonShell layout="section" label="Cargando clasificación" className={className}>
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex justify-center gap-2">
          {Array.from({ length: 5 }, (_, index) => (
            <SkeletonBlock key={index} className="h-12 w-12 rounded-full" />
          ))}
        </div>
        <div className="space-y-2">
          {Array.from({ length: 10 }, (_, index) => (
            <div
              key={index}
              className="border-surface-border/80 bg-surface-elevated/40 flex items-center gap-3 rounded-2xl border px-4 py-3"
            >
              <SkeletonBlock className="h-3 w-4" />
              <SkeletonBlock className="h-10 w-10 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <SkeletonBlock className="h-3 w-3/5 max-w-[12rem]" />
                <SkeletonBlock className="h-2 w-2/5 max-w-[8rem]" />
              </div>
              <SkeletonBlock className="h-3 w-10" />
            </div>
          ))}
        </div>
      </div>
    </SkeletonShell>
  );
}

export function GradingSkeleton({ className }: { className?: string }) {
  return (
    <SkeletonShell layout="section" label="Calificando examen" className={className}>
      <div className="mx-auto max-w-xl space-y-4 text-center">
        <SkeletonBlock className="mx-auto h-16 w-16 rounded-full" />
        <SkeletonBlock className="mx-auto h-6 w-48" />
        <SkeletonBlock className="mx-auto h-4 w-64" />
        <SkeletonBlock className="h-2 w-full rounded-full" />
      </div>
    </SkeletonShell>
  );
}

export function AuthPageSkeleton({ className }: { className?: string }) {
  return (
    <SkeletonShell layout="page" label="Cargando" className={className}>
      <div className="mx-auto flex min-h-dvh max-w-md flex-col">
        <div className="flex items-center justify-between py-4">
          <SkeletonBlock className="h-8 w-8 rounded-lg" />
          <SkeletonBlock className="h-5 w-32" />
          <SkeletonBlock className="h-8 w-8 rounded-lg" />
        </div>
        <SkeletonBlock className="mb-6 h-px w-full" />
        <div className="flex flex-1 flex-col justify-center space-y-4 py-8">
          <SkeletonBlock className="h-12 w-full rounded-xl" />
          <SkeletonBlock className="h-12 w-full rounded-xl" />
          <SkeletonBlock className="h-11 w-full rounded-xl" />
          <SkeletonBlock className="mx-auto h-4 w-40" />
        </div>
        <div className="pb-6 text-center">
          <SkeletonBlock className="mx-auto h-4 w-56" />
        </div>
      </div>
    </SkeletonShell>
  );
}

export function OnboardingPageSkeleton({ className }: { className?: string }) {
  return (
    <SkeletonShell layout="page" label="Cargando evaluación" className={className}>
      <div className="mx-auto flex min-h-dvh max-w-2xl flex-col">
        <div className="flex h-16 items-center px-2">
          <SkeletonBlock className="h-10 w-10 rounded-lg" />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
          <SkeletonBlock className="mb-8 h-28 w-28 rounded-full" />
          <div className="border-surface-border bg-surface-overlay/50 w-full space-y-4 rounded-lg border p-8">
            <SkeletonBlock className="mx-auto h-7 w-3/4" />
            <SkeletonBlock className="mx-auto h-4 w-full max-w-md" />
            <SkeletonBlock className="mx-auto h-4 w-5/6 max-w-sm" />
          </div>
        </div>
        <div className="mx-auto w-full max-w-md px-4 pb-8">
          <SkeletonBlock className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </SkeletonShell>
  );
}
