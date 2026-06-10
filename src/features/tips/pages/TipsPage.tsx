'use client';

import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';
import { PAGE_SHELL_CLASS } from '@/shared/constants/pageShell';
import { LecturaSectionShell, LECTURA_CONSEJOS_ACCENT } from '@/features/lectura';
import { cn } from '@/utils/cn';
import { TipsCategoriesSections } from '../components/TipsCategoriesSections';

const internalLinkClass = cn(
  'text-app-accent font-semibold underline underline-offset-2',
  'hover:text-app-accent-muted transition-colors',
  'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
  'focus-visible:ring-offset-surface'
);

export function TipsPage() {
  return (
    <div className={PAGE_SHELL_CLASS}>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="from-app-ring/10 absolute top-0 left-0 h-96 w-full bg-linear-to-b to-transparent" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-violet-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto max-w-4xl space-y-10 px-4 py-8">
        <LecturaSectionShell sectionId="consejos">
          <header className="space-y-2">
            <h1 className="text-on-surface flex items-center gap-3 text-3xl font-bold">
              <Icon name="lightbulb" className={LECTURA_CONSEJOS_ACCENT.headerIconClassName} />
              Consejos de preparación
            </h1>
            <p className="text-on-surface-muted max-w-2xl leading-relaxed">
              Aprende a gestionar tu tiempo, estudiar con método y llegar al ICFES con confianza. Guías prácticas para
              complementar tu ruta en la plataforma.
            </p>
          </header>

          <TipsCategoriesSections />

          <p className="text-on-surface-muted text-sm leading-relaxed">
            Las infografías oficiales del Saber 11° y los enlaces al sitio del ICFES están en{' '}
            <Link href="/informacion" className={internalLinkClass}>
              Información del ICFES
            </Link>
            .
          </p>
        </LecturaSectionShell>
      </div>
    </div>
  );
}
