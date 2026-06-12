'use client';

import { Icon } from '@/shared/components/Icon';
import { LecturaSectionShell } from '@/features/lectura';
import { LECTURA_PAGE_SHELL_CLASS } from '@/features/lectura/constants';
import { cn } from '@/utils/cn';
import { IcfesInfographicsSection } from '@/features/tips/components/IcfesInfographicsSection';
import { IcfesOfficialLinksSection } from '../components/IcfesOfficialLinksSection';
import { useContentVariant } from '@/features/content/components/ContentPageShell';

export function InformacionPage() {
  const variant = useContentVariant();
  const isFull = variant === 'full';

  return (
    <div className={cn(LECTURA_PAGE_SHELL_CLASS, 'max-w-4xl space-y-10')}>
      <LecturaSectionShell sectionId="informacion">
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

        {isFull ? <IcfesInfographicsSection /> : null}

        <IcfesOfficialLinksSection />
      </LecturaSectionShell>
    </div>
  );
}
