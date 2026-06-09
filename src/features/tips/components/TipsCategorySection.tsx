import { Icon } from '@/shared/components/Icon';
import type { TipCategory } from '../data/tips';
import { TipCard } from './TipCard';

type TipsCategorySectionProps = {
  category: TipCategory;
};

export function TipsCategorySection({ category }: TipsCategorySectionProps) {
  return (
    <section aria-labelledby={`tips-${category.id}`} className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="bg-app-ring/15 text-app-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
          <Icon name={category.icon} />
        </div>
        <div>
          <h2 id={`tips-${category.id}`} className="text-on-surface text-xl font-bold">
            {category.title}
          </h2>
          <p className="text-on-surface-muted mt-1 text-sm">{category.description}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {category.tips.map((tip) => (
          <TipCard key={tip.title} title={tip.title} description={tip.description} />
        ))}
      </div>
    </section>
  );
}
