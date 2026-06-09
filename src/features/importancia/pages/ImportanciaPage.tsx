'use client';

import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';
import { PAGE_SHELL_CLASS } from '@/shared/constants/pageShell';
import { LecturaSectionShell } from '@/features/lectura';
import { cn } from '@/utils/cn';
import { ImportanciaGeneralSections } from '../components/ImportanciaGeneralSections';
import { ImportanciaSaber11Panel } from '../components/ImportanciaSaber11Panel';
import { ImportanciaValidacionPanel } from '../components/ImportanciaValidacionPanel';

const internalLinkClass = cn(
  'text-app-accent font-semibold underline underline-offset-2',
  'hover:text-app-accent-muted transition-colors',
  'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
  'focus-visible:ring-offset-surface'
);

export function ImportanciaPage() {
  return (
    <div className={PAGE_SHELL_CLASS}>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="from-app-ring/10 absolute top-0 left-0 h-96 w-full bg-linear-to-b to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto max-w-4xl space-y-10 px-4 py-8">
        <LecturaSectionShell sectionId="importancia">
        <header className="space-y-2">
          <h1 className="text-on-surface flex items-center gap-3 text-3xl font-bold">
            <Icon name="info-circle" className="text-app-accent" />
            Importancia del ICFES y el bachiller
          </h1>
          <p className="text-on-surface-muted max-w-3xl leading-relaxed">
            Terminar el bachillerato y prepararte para el examen no es solo un trámite escolar:{' '}
            <strong className="text-on-surface font-semibold">
              abre opciones reales en empleo, ingresos y proyectos de vida
            </strong>
            . Abajo encontrarás lo que aplica para todos y, en los menús desplegables, la información específica del
            Saber 11° o de la Prueba de Validación, según tu caso.
          </p>
        </header>

        <ImportanciaGeneralSections />

        <div className="space-y-4">
          <h2 className="text-on-surface text-xl font-bold">Elige tu camino</h2>
          <p className="text-on-surface-muted text-sm leading-relaxed">
            Despliega el menú que corresponda a tu situación para ver requisitos, áreas y consejos específicos.
          </p>
          <ImportanciaSaber11Panel />
          <ImportanciaValidacionPanel />
        </div>

        <p className="text-on-surface-muted text-sm leading-relaxed">
          Infografías, tarifas, fechas e inscripción:{' '}
          <Link href="/informacion" className={internalLinkClass}>
            Información del ICFES
          </Link>
          .
        </p>

        <aside className="border-app-ring/20 bg-surface-elevated/60 rounded-2xl border p-6">
          <p className="text-on-surface leading-relaxed">
            Prepararte con método —ya sea para el Saber 11° o para la Prueba de Validación— es invertir en más opciones
            para tu futuro. <strong className="text-app-accent font-semibold">ICFES Master</strong> está aquí para
            ayudarte con práctica, simulacros y una ruta de aprendizaje guiada{' '}
            <strong className="font-semibold">hacia un puntaje que amplíe tus posibilidades</strong>.
          </p>
        </aside>
        </LecturaSectionShell>
      </div>
    </div>
  );
}
