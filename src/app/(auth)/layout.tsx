import type { Metadata } from 'next';

import { cn } from '@/utils/cn';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'from-surface via-surface-via to-surface text-on-surface relative flex h-dvh flex-col',
        'bg-linear-to-b'
      )}
    >
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="bg-ambient-a/30 absolute top-1/3 left-1/4 h-96 w-96 animate-pulse rounded-full blur-3xl" />
        <div className="bg-ambient-b/30 absolute right-1/4 bottom-1/3 h-96 w-96 animate-pulse rounded-full blur-3xl" />
        <div className="bg-ambient-c/20 absolute top-2/3 left-3/4 h-72 w-72 animate-pulse rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
