import Link from 'next/link';
import { cn } from '@/utils/cn';
import { Icon, type IconName } from '@/shared/components/Icon';

type EmptyStateProps = {
  icon?: IconName;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
};

export function EmptyState({
  icon = 'clipboard-list',
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'border-surface-border bg-surface-elevated/40 rounded-3xl border border-dashed py-12 text-center',
        className
      )}
    >
      <Icon name={icon} size="2xl" className="text-on-surface-muted mx-auto mb-4" />
      <p className="text-on-surface mb-2 text-lg font-semibold">{title}</p>
      {description && <p className="text-on-surface-muted mx-auto mb-4 max-w-md text-sm">{description}</p>}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className={cn(
            'bg-app-ring/15 text-app-accent hover:bg-app-ring/25 inline-flex rounded-xl px-4 py-2 text-sm font-semibold',
            'focus-visible:ring-app-accent transition-colors focus-visible:ring-2 focus-visible:outline-none'
          )}
        >
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionHref && (
        <button
          type="button"
          onClick={onAction}
          className={cn(
            'bg-app-ring/15 text-app-accent hover:bg-app-ring/25 inline-flex cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold',
            'focus-visible:ring-app-accent transition-colors focus-visible:ring-2 focus-visible:outline-none'
          )}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
