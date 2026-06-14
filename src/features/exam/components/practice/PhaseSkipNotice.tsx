import { cn } from '@/utils/cn';

type PhaseSkipNoticeProps = {
  phaseTitle?: string;
  passPercent: number;
  className?: string;
};

export function PhaseSkipNotice({ phaseTitle, passPercent, className }: PhaseSkipNoticeProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100',
        className
      )}
    >
      Simulacro para completar <span className="font-semibold">{phaseTitle ?? 'esta fase'}</span>. Necesitas al menos{' '}
      <span className="font-semibold">{passPercent}%</span> de aciertos para completar esta fase.
    </div>
  );
}
