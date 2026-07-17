import { Icon } from '@/shared/components/Icon';

const ICFES_SABER_11_URL = 'https://www.icfes.gov.co/evaluaciones-icfes/saber-11/';
const ICFES_VALIDACION_URL =
  'https://www.icfes.gov.co/evaluaciones-icfes/1-acerca-del-examen-validacion-del-bachillerato-academico/';

const externalLinkClass =
  'text-app-accent font-medium underline underline-offset-2 hover:text-app-accent-muted transition-colors focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none focus-visible:ring-offset-surface';

export function IcfesOfficialLinksSection() {
  return (
    <section
      aria-labelledby="informacion-fuentes-oficiales"
      className="border-surface-border bg-surface-elevated/40 space-y-4 rounded-2xl border border-dashed p-6"
    >
      <h2 id="informacion-fuentes-oficiales" className="text-on-surface flex items-center gap-2 text-lg font-semibold">
        <Icon name="globe" className="text-app-accent" size="sm" />
        Más información oficial del ICFES
      </h2>
      <p className="text-on-surface-muted leading-relaxed">
        Si quieres profundizar en cómo funcionan las pruebas —tarifas, fechas de inscripción, requisitos, citaciones,
        resultados, marcos de referencia y trámites—, el ICFES publica el detalle en su sitio web. Allí encontrarás
        respuestas a dudas frecuentes sobre la forma, el calendario y el funcionamiento de cada examen.
      </p>
      <ul className="text-on-surface-muted space-y-3 leading-relaxed">
        <li>
          <strong className="text-on-surface font-medium">Saber 11°:</strong> objetivos del examen, etapas previas,
          tarifas, guía de orientación, fechas y resultados.{' '}
          <a href={ICFES_SABER_11_URL} target="_blank" rel="noopener noreferrer" className={externalLinkClass}>
            Ver información oficial del Saber 11°
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        </li>
        <li>
          <strong className="text-on-surface font-medium">Validación del bachillerato académico:</strong> requisitos,
          etapas previas, tarifas, fechas, resultados y marcos de referencia.{' '}
          <a href={ICFES_VALIDACION_URL} target="_blank" rel="noopener noreferrer" className={externalLinkClass}>
            Ver información oficial de la Validación
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        </li>
      </ul>
    </section>
  );
}
