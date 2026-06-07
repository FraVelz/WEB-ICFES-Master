// Shared layout shell for onboarding screens
import { cn } from '@/utils/cn';
import { FULL_PAGE_SHELL_CLASS } from '@/shared/constants/pageShell';

export const OnboardingLayout = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('relative flex flex-col', FULL_PAGE_SHELL_CLASS, className)}>
    {/* Background glow effects - Fixed position */}
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="bg-ambient-a/30 absolute top-1/3 left-1/4 h-96 w-96 animate-pulse rounded-full blur-3xl"></div>
      <div className="bg-ambient-b/30 absolute right-1/4 bottom-1/3 h-96 w-96 animate-pulse rounded-full blur-3xl"></div>
    </div>
    {/* Content wrapper */}
    <div className="relative z-10 flex w-full flex-1 flex-col">{children}</div>
  </div>
);
