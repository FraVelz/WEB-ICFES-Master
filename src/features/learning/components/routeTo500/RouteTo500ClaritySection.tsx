import { ROUTE_TO_500_CLARITY_ITEMS } from '@/features/learning/data/routeTo500';
import { cn } from '@/utils/cn';

export function RouteTo500ClaritySection() {
  return (
    <section
      aria-labelledby="route-clarity-title"
      className={cn(
        'border-surface-border bg-surface-elevated/60 rounded-2xl border p-4 sm:p-5',
        'bg-linear-to-br from-amber-500/5 to-transparent'
      )}
    >
      <h2 id="route-clarity-title" className="text-on-surface text-base font-bold sm:text-lg">
        Tres cosas que no son lo mismo
      </h2>
      <ul className="mt-3 space-y-3">
        {ROUTE_TO_500_CLARITY_ITEMS.map((item) => (
          <li key={item.title} className="border-surface-border/60 bg-surface-via/40 rounded-xl border px-3 py-2.5">
            <p className="text-on-surface text-sm font-semibold">{item.title}</p>
            <p className="text-on-surface-muted mt-0.5 text-sm leading-relaxed">{item.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
