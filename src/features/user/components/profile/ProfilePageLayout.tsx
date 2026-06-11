import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { PageThemeControl } from '@/components/PageThemeControl';
import { PAGE_SHELL_CLASS } from '@/shared/constants/pageShell';

export function ProfilePageLayout({
  children,
  glowVariant = 'default',
}: {
  children: ReactNode;
  glowVariant?: 'default' | 'public';
}) {
  return (
    <div className={PAGE_SHELL_CLASS}>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {glowVariant === 'public' ? (
          <>
            <div
            className={cn(
              "absolute top-0 left-0 h-96 w-full bg-linear-to-b from-purple-200/40",
              "to-transparent dark:from-purple-900/20"
            )}/>
            <div
            className={cn(
              "bg-app-ring/10 dark:bg-app-ring/10 absolute top-1/4 left-0 h-96 w-96",
              "rounded-full blur-3xl"
            )}/>
          </>
        ) : (
          <>
            <div
            className={cn(
              "from-hub-sheet-from/30 dark:from-hub-sheet-from/20 absolute top-0 left-0 h-96",
              "w-full bg-linear-to-b to-transparent"
            )}/>
            <div
            className={cn(
              "absolute top-1/4 right-0 h-96 w-96 rounded-full bg-purple-300/20 blur-3xl",
              "dark:bg-purple-500/10"
            )}/>
          </>
        )}
      </div>
      <div className="relative z-10 container mx-auto max-w-6xl px-4 py-8">
        <PageThemeControl />
        {children}
      </div>
    </div>
  );
}
