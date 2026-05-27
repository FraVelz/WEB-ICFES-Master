import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';
import { cn } from '@/utils/cn';
import type { NavOption } from './types';

type MobileMenuLinkProps = {
  option: NavOption;
  isLocked: boolean;
  onNavigate: () => void;
};

export function MobileMenuLink({ option, isLocked, onNavigate }: MobileMenuLinkProps) {
  return (
    <Link
      href={option.path}
      className={cn(
        'hover:bg-app-ring/10 active:bg-app-ring/20 flex items-center gap-4 px-6 py-4 text-slate-300 transition-colors',
        'focus-visible:ring-app-accent rounded-lg focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
        isLocked && 'opacity-70'
      )}
      onClick={onNavigate}
    >
      <Icon name={option.icon} size="xl" className="text-app-accent" />
      <span className="flex flex-1 items-center justify-between text-lg font-semibold">
        {option.label}
        {isLocked && <Icon name="lock" className="text-slate-500" />}
      </span>
    </Link>
  );
}
