import type { ReactNode } from 'react';

type FullExamShellProps = {
  children: ReactNode;
};

export function FullExamShell({ children }: FullExamShellProps) {
  return (
    <div className="min-h-dvh bg-linear-to-br from-gray-900 via-surface-elevated to-gray-900 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className={[
            'bg-lesson-lc-glow-a/20 absolute top-0 left-1/4 h-96 w-96',
            'animate-pulse rounded-full blur-3xl',
          ].join(' ')}
        />
        <div
          className={[
            'absolute right-1/4 bottom-0 h-96 w-96 animate-pulse rounded-full',
            'bg-purple-500/20 blur-3xl',
          ].join(' ')}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
