'use client';

import { Icon } from '@/shared/components/Icon';
import { cn } from '@/utils/cn';
import { ImportanciaContentSection } from './ImportanciaContentSection';

export function ImportanciaSaber11Panel() {
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
          <Icon name="graduation-cap" />
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <h2 className="text-on-surface text-lg font-bold">Saber 11° (ICFES)</h2>
          <p className="text-on-surface-muted mt-1 text-sm leading-relaxed">
            Para estudiantes que terminan grado 11 y buscan ingresar a la universidad o programas con puntaje.
          </p>
        </div>
        <Icon
          name="chevron-down"
          className={cn(
            'text-on-surface-muted mt-1 shrink-0 transition-transform',
            'group-open:rotate-180'
          )}
        />
      </summary>

      <div className="border-app-ring/10 space-y-8 border-t px-5 pt-2 pb-6">
        <ImportanciaContentSection id="saber-quien" title="¿Para quién es?" icon="circle-user" nested>
          <p className="text-on-surface-muted leading-relaxed">
            El Saber 11° está pensado para jóvenes que culminan el grado 11 en colegio, institución o modalidad flexible,
            y que necesitan el puntaje para postularse a programas de educación superior, becas, créditos o convenios que
            exigen resultados del ICFES.
          </p>
          <p className="text-on-surface-muted leading-relaxed">
            Evalúa los mismos criterios y competencias del bachillerato que la Prueba de Validación: no es un examen
            distinto en contenido, sino el camino para quienes terminan el grado 11 en la ruta escolar tradicional.
          </p>
        </ImportanciaContentSection>

        <ImportanciaContentSection id="saber-para-que" title="¿Para qué sirve el puntaje?" icon="bullseye" nested>
          <p className="text-on-surface-muted leading-relaxed">
            Las universidades e institutos usan el puntaje global y por área para admisión, cupos especiales y becas. Un
            buen resultado{' '}
            <strong className="text-on-surface font-semibold">
              amplía las opciones de carrera, ciudad e institución
            </strong>
            ; un puntaje bajo puede limitar programas competitivos, aunque siempre hay rutas alternativas (tecnología,
            ciclos propedéuticos, etc.).
          </p>
          <ul className="text-on-surface-muted list-disc space-y-2 pl-5 leading-relaxed">
            <li>Admisión a pregrado en universidades públicas y privadas.</li>
            <li>Becas del Estado, entidades territoriales o convenios institucionales.</li>
            <li>Programas que exigen mínimos por área (p. ej. salud o ingeniería).</li>
          </ul>
        </ImportanciaContentSection>

        <ImportanciaContentSection id="saber-areas" title="Áreas que presentas" icon="book-open" nested>
          <p className="text-on-surface-muted leading-relaxed">
            Presentas las cinco pruebas obligatorias del Saber 11° —las mismas áreas que la Prueba de Validación—. Cada
            una aporta al puntaje global y muchas instituciones revisan también el desempeño por materia.
          </p>
          <ul className="text-on-surface-muted list-disc space-y-2 pl-5 leading-relaxed">
            <li>Lectura crítica</li>
            <li>Matemáticas</li>
            <li>Ciencias naturales</li>
            <li>Sociales y ciudadanas</li>
            <li>Inglés</li>
          </ul>
        </ImportanciaContentSection>

        <ImportanciaContentSection id="saber-preparacion" title="Cómo prepararte" icon="lightbulb" nested>
          <p className="text-on-surface-muted leading-relaxed">
            Combina repaso de tu grado 11, simulacros cronometrados y análisis de errores. Identifica áreas débiles con
            tiempo: suele ser más rentable subir matemáticas o lectura crítica que repasar todo por igual.{' '}
            <strong className="text-on-surface font-semibold">
              Estudiar un poco cada día suele rendir más que acumular horas de un solo golpe
            </strong>
            .
          </p>
          <p className="text-on-surface-muted leading-relaxed">
            <strong className="text-app-accent font-semibold">ICFES Master</strong> es nuestra plataforma web gratuita
            para practicar por área, hacer simulacros completos y seguir una ruta según tu nivel. La estamos construyendo
            para ayudarte a{' '}
            <strong className="text-on-surface font-semibold">
              alcanzar un puntaje alto en el ICFES, desde 0 hasta 500 puntos
            </strong>
            , adaptándonos a tu preparación previa, al tiempo que puedas dedicar y a tu ritmo de avance.
          </p>
        </ImportanciaContentSection>
      </div>
    </details>
  );
}
