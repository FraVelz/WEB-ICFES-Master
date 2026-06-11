'use client';

import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';
import { cn } from '@/utils/cn';
import { FOCUS_RING, isNavOptionActive, SIDEBAR_NAV_HOVER, type NavOption } from './constants';

type SidebarNavLinkProps = {
  option: NavOption;
  pathname: string;
  sidebarExpanded: boolean;
  isLocked: boolean;
};

export function SidebarNavLink({ option, pathname, sidebarExpanded, isLocked }: SidebarNavLinkProps) {
  const isActive = isNavOptionActive(pathname, option);
  const accent = option.accent ?? 'default';

  return (
    <Link
      href={option.path}
      aria-label={!sidebarExpanded ? option.label : undefined}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'group/item relative flex h-12 items-center rounded-xl transition-all duration-300 focus-visible:z-10',
        sidebarExpanded ? 'gap-3 px-3' : 'justify-center px-0',
        FOCUS_RING,
        isActive
          ? accent === 'orange'
            ? cn(
                'bg-orange-500/15 text-orange-400 shadow-lg shadow-orange-500/10',
                !sidebarExpanded && 'ring-2 ring-orange-400/45'
              )
            : cn(
                'bg-app-ring/15 text-app-accent shadow-app-ring/25 shadow-lg',
                !sidebarExpanded && 'ring-app-accent/45 ring-2'
              )
          : cn(SIDEBAR_NAV_HOVER, 'group-hover/item:scale-[1.02]'),
        isLocked && 'opacity-70'
      )}
    >
      <Icon
        name={option.icon}
        size="lg"
        className={cn(
          'shrink-0 transition-all duration-300',
          !isActive && 'group-hover/item:text-app-accent group-hover/item:scale-110',
          isActive && !sidebarExpanded && 'scale-110',
          isActive && 'drop-shadow-[0_0_8px_currentColor]'
        )}
      />
      {sidebarExpanded && (
        <span className="group-hover/item:text-app-accent font-medium whitespace-nowrap transition-colors">
          {option.label}
          {isLocked && <Icon name="lock" size="sm" className="ml-1.5 inline text-on-surface-muted" />}
        </span>
      )}
      {isActive && option.showActiveIndicator !== false && sidebarExpanded && (
        <div className="bg-app-ring absolute top-1/2 right-0 h-6 w-1 -translate-y-1/2 rounded-l-full" />
      )}
      {isActive && !sidebarExpanded && (
        <span
          className={cn(
            'absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full',
            accent === 'orange' ? 'bg-orange-400' : 'bg-app-accent'
          )}
        />
      )}
    </Link>
  );
}
