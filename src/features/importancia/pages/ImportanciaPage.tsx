'use client';

import { Icon } from '@/shared/components/Icon';
import { ImportanciaGeneralSections } from '../components/ImportanciaGeneralSections';
import { ImportanciaSaber11Panel } from '../components/ImportanciaSaber11Panel';
import { ImportanciaValidacionPanel } from '../components/ImportanciaValidacionPanel';

export function ImportanciaPage() {
  return (
    <div className="min-h-dvh bg-linear-to-b from-surface via-surface-via to-surface pb-24 text-on-surface md:pb-0">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="from-app-ring/10 absolute top-0 left-0 h-96 w-full bg-linear-to-b to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto max-w-4xl space-y-10 px-4 py-8">
        <header className="space-y-2">
          <h1 className="text-on-surface flex items-center gap-3 text-3xl font-bold">
            <Icon name="info-circle" className="text-app-accent" />
            Importancia del ICFES y el bachiller
          </h1>
          <p className="text-on-surface-muted max-w-3xl leading-relaxed">
            Terminar el bachillerato y prepararte para el examen no es solo un trámite escolar: abre puertas reales en
            empleo, ingresos, estabilidad y proyectos de vida. Abajo encontrarás lo que aplica para todos y, en los
            menús desplegables, la información específica del Saber 11° o de la Prueba de Validación, según tu caso.
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

        <aside className="border-app-ring/20 bg-surface-elevated/60 rounded-2xl border p-6">
          <p className="text-on-surface leading-relaxed">
            Prepararte con método —ya sea para el Saber 11° o para la Prueba de Validación— es invertir en opciones: más
            ingresos, más estabilidad, más libertad para elegir qué quieres hacer. ICFES Master está aquí para ayudarte
            en ese camino con práctica, simulacros y una ruta de aprendizaje guiada.
          </p>
        </aside>
      </div>
    </div>
  );
}
