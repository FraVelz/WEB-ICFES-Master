import type { ReactNode } from 'react';

type FullExamShellProps = {
  children: ReactNode;
};

export function FullExamShell({ children }: FullExamShellProps) {
  return (
    <div className="from-surface via-surface-via to-surface text-on-surface flex h-dvh flex-col overflow-hidden bg-linear-to-br [--exam-sticky-offset:6.25rem]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className={[
            'bg-lesson-lc-glow-a/10 dark:bg-lesson-lc-glow-a/20 absolute top-0 left-1/4 h-96 w-96',
            'animate-pulse rounded-full blur-3xl',
          ].join(' ')}
        />
        <div
          className={[
            'absolute right-1/4 bottom-0 h-96 w-96 animate-pulse rounded-full',
            'bg-purple-500/10 blur-3xl dark:bg-purple-500/20',
          ].join(' ')}
        />
      </div>
      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</div>
    </div>
  );
}
