import { cn } from '@/utils/cn';
import { LEAGUES_DISABLED_MESSAGE } from '@/shared/constants/gamification';

type LeagueDisabledNoticeProps = {
  className?: string;
};

export function LeagueDisabledNotice({ className }: LeagueDisabledNoticeProps) {
  return (
    <p
      role="status"
      className={cn(
        'rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-xs leading-relaxed',
        'text-amber-900 dark:text-amber-100',
        className
      )}
    >
      {LEAGUES_DISABLED_MESSAGE}
    </p>
  );
}
