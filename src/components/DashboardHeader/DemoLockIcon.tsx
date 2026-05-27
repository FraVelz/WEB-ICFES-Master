import { Icon } from '@/shared/components/Icon';
import { cn } from '@/utils/cn';

type DemoLockIconProps = {
  className?: string;
};

export function DemoLockIcon({ className }: DemoLockIconProps) {
  return <Icon name="lock" size="sm" className={cn('ml-1.5 inline text-slate-500', className)} />;
}
