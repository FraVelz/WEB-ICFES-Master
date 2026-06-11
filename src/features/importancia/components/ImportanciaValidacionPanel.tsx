'use client';

import { Icon } from '@/shared/components/Icon';
import { cn } from '@/utils/cn';
import { ImportanciaContentSection } from './ImportanciaContentSection';

export function ImportanciaValidacionPanel() {
  return (
    <details className="border-app-ring/20 bg-surface-elevated/40 group rounded-2xl border">
      <summary
        className={cn(
          'flex cursor-pointer list-none items-start gap-3 rounded-2xl p-5 transition-colors',
          'hover:bg-surface-elevated/60',
          '[&::-webkit-details-marker]:hidden'
        )}
      >
        <div className="bg-app-ring/15 text-app-accent flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
          <Icon name="clipboard-list" />
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <h2 className="text-on-surface text-lg font-bold">Prueba de Validación del bachillerato</h2>
          <p className="text-on-surface-muted mt-1 text-sm leading-relaxed">
            Para personas adultas que no terminaron el bachiller en la ruta tradicional y quieren acreditarlo.
          </p>
        </div>
        <Icon
          name="chevron-down"
          className={cn('text-on-surface-muted mt-1 shrink-0 transition-transform', 'group-open:rotate-180')}
        />
      </summary>

      <div className="border-app-ring/10 space-y-8 border-t px-5 pt-2 pb-6">
        <ImportanciaContentSection id="validacion-quien" title="¿Para quién es?" icon="circle-user" nested>
          <p className="text-on-surface-muted leading-relaxed">
            La Prueba de Validación está dirigida a personas mayores de edad que, por trabajo, migración, embarazo,
            responsabilidades familiares u otras razones, no completaron el bachillerato en el colegio y necesitan el
            título para continuar estudios, ascender laboralmente o cumplir requisitos formales.
          </p>
          <p className="text-on-surface-muted leading-relaxed">
            Mide los mismos aprendizajes del bachillerato que el Saber 11°: mismas cinco áreas y mismo enfoque de
            evaluación. La diferencia está en quién la presenta y en que, al aprobar, acreditas el bachiller que no
            obtuviste en la ruta escolar tradicional.
          </p>
        </ImportanciaContentSection>

        <ImportanciaContentSection
          id="validacion-para-que"
          title="¿Qué obtienes al aprobar?"
          icon="check-circle"
          nested
        >
          <p className="text-on-surface-muted leading-relaxed">
            Al superar la validación obtienes la acreditación del bachillerato académico. Eso te habilita para
            inscribirte en educación superior, postular a empleos que piden diploma y acceder a trámites que antes te
            quedaban cerrados.
          </p>
          <p className="text-on-surface-muted leading-relaxed">
            Tu puntaje se reporta en la misma escala que el Saber 11°. Las universidades y entidades que piden puntaje
            ICFES reconocen{' '}
            <strong className="text-on-surface font-semibold">
              un buen resultado en validación como comparable al de un estudiante de grado 11
            </strong>
            .
          </p>
        </ImportanciaContentSection>

        <ImportanciaContentSection id="validacion-areas" title="Áreas que presentas" icon="book-open" nested>
          <p className="text-on-surface-muted leading-relaxed">
            Las pruebas cubren los mismos aprendizajes y las mismas cinco áreas que el Saber 11°. No es un examen “más
            fácil”: exige dominar contenidos que muchas personas retoman después de años sin estudiar, aunque con una
            preparación ordenada es un reto alcanzable.
          </p>
          <ul className="text-on-surface-muted list-disc space-y-2 pl-5 leading-relaxed">
            <li>Lectura crítica</li>
            <li>Matemáticas</li>
            <li>Ciencias naturales</li>
            <li>Sociales y ciudadanas</li>
            <li>Inglés</li>
          </ul>
        </ImportanciaContentSection>

        <ImportanciaContentSection id="validacion-ruta" title="Ruta típica de preparación" icon="map" nested>
          <p className="text-on-surface-muted leading-relaxed">
            Muchos adultos combinan estudio autónomo, cursos de validación en instituciones educativas y práctica con
            simulacros. Lo habitual es inscribirse en un programa de educación para adultos o validación, cumplir
            requisitos de la secretaría de educación y presentar la prueba en las fechas del calendario ICFES.
          </p>
          <p className="text-on-surface-muted leading-relaxed">
            Si trabajas a tiempo completo, planifica bloques cortos pero constantes:{' '}
            <strong className="text-on-surface font-semibold">
              30–45 minutos al día suelen rendir más que estudiar solo los fines de semana
            </strong>
            .
          </p>
          <ul className="text-on-surface-muted list-disc space-y-2 pl-5 leading-relaxed">
            <li>
              Consulta requisitos e inscripción en tu secretaría de educación, en un centro de validación o en la página
              web del ICFES.
            </li>
            <li>Repasa por áreas empezando por lectura crítica y matemáticas.</li>
            <li>Usa simulacros para acostumbrarte al tiempo y al formato.</li>
          </ul>
          <p className="text-on-surface-muted leading-relaxed">
            Puedes complementar esa ruta con <strong className="text-app-accent font-semibold">ICFES Master</strong>,
            nuestra web gratuita para practicar por área y hacer simulacros. La plataforma está pensada para ayudarte a{' '}
            <strong className="text-on-surface font-semibold">subir tu puntaje ICFES, desde 0 hasta 500 puntos</strong>,
            según tu nivel de partida, el tiempo que dediques y la constancia con la que estudies —útil si retomas
            contenidos después de años sin verlos en un aula.
          </p>
        </ImportanciaContentSection>

        <ImportanciaContentSection id="validacion-despues" title="Después de validar" icon="arrow-up" nested>
          <p className="text-on-surface-muted leading-relaxed">
            Con bachiller acreditado puedes postular a tecnología, universidad o empleos formales.{' '}
            <strong className="text-on-surface font-semibold">
              Un puntaje alto en validación abre las mismas puertas académicas que un buen Saber 11°
            </strong>
            : no compites con un estándar distinto.
          </p>
          <p className="text-on-surface-muted leading-relaxed">
            Muchas personas usan la validación como primer paso y luego continúan a pregrado, emprendimiento
            especializado o formación técnica en el área que les interesa.
          </p>
        </ImportanciaContentSection>
      </div>
    </details>
  );
}
