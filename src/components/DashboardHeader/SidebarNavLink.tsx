import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';
import { cn } from '@/utils/cn';
import { FOCUS_RING } from './constants';
import { DemoLockIcon } from './DemoLockIcon';
import { ExpandableSidebarText } from './ExpandableSidebarText';
import type { NavOption } from './types';

type SidebarNavLinkProps = {
  option: NavOption;
  pathname: string;
  sidebarExpanded: boolean;
  isLocked: boolean;
};

export function SidebarNavLink({ option, pathname, sidebarExpanded, isLocked }: SidebarNavLinkProps) {
  const isActive = pathname === option.path;
  const accent = option.accent ?? 'default';

  return (
    <Link
      href={option.path}
      className={cn(
        'group/item relative flex h-12 items-center rounded-xl px-3 transition-all duration-300 focus-visible:z-10',
        FOCUS_RING,
        isActive
          ? accent === 'orange'
            ? 'bg-orange-500/10 text-orange-400'
            : 'bg-app-ring/10 text-app-accent shadow-app-ring/5 shadow-lg'
          : 'text-slate-400 hover:bg-white/5 hover:text-white',
        isLocked && 'opacity-70'
      )}
    >
      <div className="flex w-6 shrink-0 justify-center">
        <Icon name={option.icon} size="lg" />
      </div>
      <ExpandableSidebarText expanded={sidebarExpanded} className="absolute left-14 font-medium">
        {option.label}
        {isLocked && <DemoLockIcon />}
      </ExpandableSidebarText>
      {isActive && option.showActiveIndicator !== false && (
        <div className="bg-app-ring absolute top-1/2 right-0 h-6 w-1 -translate-y-1/2 rounded-l-full" />
      )}
    </Link>
  );
}
