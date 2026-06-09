'use client';

import { Icon } from '@/shared/components/Icon';
import { PAGE_SHELL_CLASS } from '@/shared/constants/pageShell';
import { TIP_CATEGORIES } from '../data/tips';
import { PersonalizedTipsSection } from '../components/PersonalizedTipsSection';
import { TipsCategorySection } from '../components/TipsCategorySection';

export function TipsPage() {
  return (
    <div className={PAGE_SHELL_CLASS}>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="from-app-ring/10 absolute top-0 left-0 h-96 w-full bg-linear-to-b to-transparent" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto max-w-4xl space-y-10 px-4 py-8">
        <header className="space-y-2">
          <h1 className="text-on-surface flex items-center gap-3 text-3xl font-bold">
            <Icon name="lightbulb" className="text-amber-400" />
            Consejos de preparación
          </h1>
          <p className="text-on-surface-muted max-w-2xl leading-relaxed">
            Aprende a gestionar tu tiempo, estudiar con método y llegar al ICFES con confianza. Guías prácticas para
            complementar tu ruta en la plataforma.
          </p>
        </header>

        <PersonalizedTipsSection />

        {TIP_CATEGORIES.map((category) => (
          <TipsCategorySection key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
