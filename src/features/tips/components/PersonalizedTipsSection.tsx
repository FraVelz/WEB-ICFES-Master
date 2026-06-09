'use client';

import { Icon } from '@/shared/components/Icon';
import { useProgress } from '@/features/user/hooks/useProgress';

export function PersonalizedTipsSection() {
  const { recommendations, loading } = useProgress();

  if (loading || recommendations.length === 0) return null;

  return (
    <section
      aria-labelledby="tips-personalized"
      className="border-app-ring/30 bg-app-ring/10 rounded-2xl border p-6 shadow-sm"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="bg-app-ring/20 text-app-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
          <Icon name="bullseye" />
        </div>
        <div>
          <h2 id="tips-personalized" className="text-on-surface text-lg font-bold">
            Consejos para ti
          </h2>
          <p className="text-on-surface-muted text-sm">Basados en tu progreso reciente en la plataforma.</p>
        </div>
      </div>

      <ul className="space-y-3">
        {recommendations.map((tip) => (
          <li key={tip} className="text-on-surface flex items-start gap-2 text-sm leading-relaxed">
            <Icon name="check-circle" className="text-app-accent mt-0.5 shrink-0" size="sm" />
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
