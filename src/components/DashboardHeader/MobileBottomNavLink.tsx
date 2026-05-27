import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';
import { cn } from '@/utils/cn';
import { FOCUS_RING } from './constants';
import type { NavOption } from './types';

type MobileBottomNavLinkProps = {
  option: NavOption;
  pathname: string;
};

export function MobileBottomNavLink({ option, pathname }: MobileBottomNavLinkProps) {
  const isActive = pathname === option.path;

  return (
    <Link
      href={option.path}
      className={cn(
        'flex h-20 w-16 flex-col items-center justify-center rounded-lg transition-all duration-300',
        FOCUS_RING,
        isActive ? 'border-app-ring text-app-accent border-t-2' : 'text-slate-400 hover:text-white'
      )}
    >
      <Icon name={option.icon} size="xl" className="mb-1" />
    </Link>
  );
}
