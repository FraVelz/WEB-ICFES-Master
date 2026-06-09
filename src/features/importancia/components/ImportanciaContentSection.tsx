import type { ReactNode } from 'react';
import { Icon } from '@/shared/components/Icon';
import { cn } from '@/utils/cn';

type ImportanciaContentSectionProps = {
  id: string;
  title: string;
  icon: string;
  nested?: boolean;
  children: ReactNode;
};

export function ImportanciaContentSection({
  id,
  title,
  icon,
  nested = false,
  children,
}: ImportanciaContentSectionProps) {
  const HeadingTag = nested ? 'h3' : 'h2';

  return (
    <section aria-labelledby={`importancia-${id}`} className="space-y-4">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'text-app-accent flex shrink-0 items-center justify-center',
            nested ? 'bg-app-ring/10 h-9 w-9 rounded-lg' : 'bg-app-ring/15 h-10 w-10 rounded-xl'
          )}
        >
          <Icon name={icon} size={nested ? 'md' : 'lg'} />
        </div>
        <div className="min-w-0 space-y-3">
          <HeadingTag
            id={`importancia-${id}`}
            className={cn('text-on-surface', nested ? 'text-lg font-semibold' : 'text-xl font-bold')}
          >
            {title}
          </HeadingTag>
          {children}
        </div>
      </div>
    </section>
  );
}
