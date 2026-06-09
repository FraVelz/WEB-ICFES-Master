import type { ReactNode } from 'react';
import { Icon } from '@/shared/components/Icon';

type TipsCategorySectionProps = {
  id: string;
  title: string;
  description: string;
  icon: string;
  children: ReactNode;
};

export function TipsCategorySection({ id, title, description, icon, children }: TipsCategorySectionProps) {
  return (
    <section aria-labelledby={`tips-${id}`} className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="bg-app-ring/15 text-app-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
          <Icon name={icon} />
        </div>
        <div>
          <h2 id={`tips-${id}`} className="text-on-surface text-xl font-bold">
            {title}
          </h2>
          <p className="text-on-surface-muted mt-1 text-sm">{description}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}
