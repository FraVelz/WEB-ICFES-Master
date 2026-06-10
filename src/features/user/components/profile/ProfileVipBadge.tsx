import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';

type ProfileVipBadgeProps = {
  className?: string;
  size?: 'sm' | 'md';
};

export function ProfileVipBadge({ className, size = 'md' }: ProfileVipBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full border font-bold',
        'border-amber-600/35 bg-amber-100 text-amber-800',
        'dark:border-yellow-500/40 dark:bg-yellow-500/15 dark:text-yellow-400',
        size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs',
        className
      )}
      title="Insignia VIP"
    >
      <Icon name="crown" size={size === 'sm' ? 'sm' : undefined} />
      VIP
    </span>
  );
}
