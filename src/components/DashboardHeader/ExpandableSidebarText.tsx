import { cn } from '@/utils/cn';
import type { ReactNode } from 'react';

type ExpandableSidebarTextProps = {
  expanded: boolean;
  children: ReactNode;
  className?: string;
};

export function ExpandableSidebarText({ expanded, children, className }: ExpandableSidebarTextProps) {
  return (
    <span
      className={cn(
        'whitespace-nowrap transition-opacity duration-300',
        expanded ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      {children}
    </span>
  );
}
