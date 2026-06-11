import { cn } from '@/utils/cn';
type TipCardProps = {
  title: string;
  description: string;
};

export function TipCard({ title, description }: TipCardProps) {
  return (
    <article
      className={cn(
        'border-surface-border bg-surface-elevated/90 hover:border-app-ring/30 rounded-2xl border',
        'p-5 shadow-sm transition-colors'
      )}
    >
      <h3 className="text-on-surface mb-2 font-semibold">{title}</h3>
      <p className="text-on-surface-muted text-sm leading-relaxed">{description}</p>
    </article>
  );
}
