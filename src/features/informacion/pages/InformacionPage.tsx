'use client';

import { Icon } from '@/shared/components/Icon';
import { PAGE_SHELL_CLASS } from '@/shared/constants/pageShell';
import { IcfesInfographicsSection } from '@/features/tips/components/IcfesInfographicsSection';
import { IcfesOfficialLinksSection } from '../components/IcfesOfficialLinksSection';

export function InformacionPage() {
  return (
    <div className={PAGE_SHELL_CLASS}>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="from-app-ring/10 absolute top-0 left-0 h-96 w-full bg-linear-to-b to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto max-w-4xl space-y-10 px-4 py-8">
        <header className="space-y-2">
          <h1 className="text-on-surface flex items-center gap-3 text-3xl font-bold">
            <Icon name="clipboard-list" className="text-app-accent" />
            Información del ICFES
          </h1>
          <p className="text-on-surface-muted max-w-3xl leading-relaxed">
            Infografías oficiales del Saber 11° y enlaces al sitio del ICFES para consultar tarifas, fechas,
            inscripción, requisitos y funcionamiento de las pruebas.
          </p>
        </header>

        <IcfesInfographicsSection />

        <IcfesOfficialLinksSection />
      </div>
    </div>
  );
}
