import { cn } from '@/utils/cn';
import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';
import { FULL_PAGE_SHELL_CLASS } from '@/shared/constants/pageShell';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Términos y Condiciones | ICFES Master' },
  description: 'Términos y condiciones de uso de ICFES Master.',
  alternates: { canonical: '/terminos/' },
};

export default function TerminosPage() {
  return (
    <div className={cn('relative px-4 py-12 sm:px-6 lg:px-8', FULL_PAGE_SHELL_CLASS)}>
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className={cn(
            'bg-lesson-lc-glow-a/20 absolute top-1/3 left-1/4 h-96 w-96',
            'animate-pulse rounded-full blur-3xl'
          )}
        />
        <div className="absolute right-1/4 bottom-1/3 h-96 w-96 animate-pulse rounded-full bg-purple-500/20 blur-3xl" />
      </div>

      <div
        className={cn(
          'border-surface-border bg-surface-elevated/90 relative z-10 mx-auto max-w-4xl',
          'rounded-2xl border p-4 shadow-sm backdrop-blur-xl sm:p-8'
        )}
      >
        <h1
          className={cn(
            'mb-4 flex items-center gap-3 bg-linear-to-r from-purple-700 to-pink-700 bg-clip-text',
            'text-4xl font-bold text-transparent dark:from-purple-400 dark:to-pink-500'
          )}
        >
          <Icon name="balance-scale" size="2xl" className="shrink-0 text-purple-700 dark:text-purple-400" />
          Términos y Condiciones
        </h1>
        <p className="text-on-surface-muted mb-8">
          <strong className="text-on-surface">ICFES Master</strong>
        </p>
        <p className="text-on-surface-muted mb-8 text-sm">Última actualización: 16 de diciembre de 2025</p>

        <div className="space-y-6">
          <p className="text-on-surface leading-relaxed">
            Al acceder y utilizar <strong className="text-purple-700 dark:text-purple-400">ICFES Master</strong>,
            aceptas los siguientes Términos y Condiciones.
          </p>

          <div>
            <h2 className="mt-8 mb-4 text-2xl font-bold text-purple-700 dark:text-purple-400">
              1. Descripción del servicio
            </h2>
            <p className="text-on-surface-muted mb-6">
              ICFES Master es una plataforma educativa diseñada para apoyar la preparación del examen ICFES mediante
              práctica, seguimiento del progreso y estadísticas académicas.
            </p>
          </div>

          <div>
            <h2 className="mt-8 mb-4 text-2xl font-bold text-purple-700 dark:text-purple-400">2. Uso adecuado</h2>
            <ul className="text-on-surface-muted mb-6 list-inside list-disc space-y-2">
              <li>Usar la plataforma únicamente con fines educativos</li>
              <li>No realizar actividades fraudulentas o malintencionadas</li>
            </ul>
          </div>

          <div>
            <h2 className="mt-8 mb-4 text-2xl font-bold text-purple-700 dark:text-purple-400">3. Cuentas de usuario</h2>
            <p className="text-on-surface-muted mb-6">
              El usuario es responsable de mantener la confidencialidad de su cuenta y de toda actividad realizada desde
              ella.
            </p>
          </div>

          <div>
            <h2 className="mt-8 mb-4 text-2xl font-bold text-purple-700 dark:text-purple-400">
              4. Resultados académicos
            </h2>
            <div
              className={cn(
                'dark:bg-lesson-math-glow-a/20 mb-6 rounded-lg border border-amber-600/35 bg-amber-100 p-4',
                'dark:border-yellow-500/50'
              )}
            >
              <p className="text-on-surface">
                <strong className="text-amber-800 dark:text-yellow-300">
                  No garantiza resultados específicos en el examen ICFES
                </strong>
                , ya que dependen de múltiples factores.
              </p>
            </div>
          </div>

          <div>
            <h2 className="mt-8 mb-4 text-2xl font-bold text-purple-700 dark:text-purple-400">
              5. Disponibilidad del servicio
            </h2>
            <p className="text-on-surface-muted mb-6">
              El servicio puede ser modificado, suspendido o actualizado en cualquier momento.
            </p>
          </div>

          <div>
            <h2 className="mt-8 mb-4 text-2xl font-bold text-purple-700 dark:text-purple-400">6. Monetización</h2>
            <p className="text-on-surface-muted mb-6">La plataforma es 100% gratuita.</p>
          </div>

          <div>
            <h2 className="mt-8 mb-4 text-2xl font-bold text-purple-700 dark:text-purple-400">
              7. Propiedad intelectual
            </h2>
            <p className="text-on-surface-muted mb-6">
              Todo el contenido de ICFES Master pertenece a sus desarrolladores.
            </p>
          </div>

          <div>
            <h2 className="mt-8 mb-4 text-2xl font-bold text-purple-700 dark:text-purple-400">
              8. Limitación de responsabilidad
            </h2>
            <ul className="text-on-surface-muted mb-6 list-inside list-disc space-y-2">
              <li>Resultados académicos obtenidos por el usuario</li>
              <li>Uso indebido de la plataforma</li>
              <li>Interrupciones temporales del servicio</li>
            </ul>
          </div>

          <div>
            <h2 className="mt-8 mb-4 text-2xl font-bold text-purple-700 dark:text-purple-400">
              9. Legislación aplicable
            </h2>
            <p className="text-on-surface-muted mb-6">
              Estos términos se rigen por las leyes de la <strong>República de Colombia</strong>.
            </p>
          </div>

          <div>
            <h2 className="mt-8 mb-4 text-2xl font-bold text-purple-700 dark:text-purple-400">10. Contacto</h2>
            <p className="text-on-surface-muted mb-6">
              <a
                href="mailto:fravelz@proton.me"
                className={cn(
                  'text-purple-700 underline hover:text-purple-800',
                  'dark:text-purple-400 dark:hover:text-purple-300'
                )}
              >
                fravelz@proton.me
              </a>
            </p>
          </div>

          <div className="border-surface-border mt-12 flex justify-center border-t pt-8">
            <Link
              href="/"
              className={cn(
                'flex items-center gap-2 rounded-lg bg-linear-to-r from-purple-500 to-pink-600 px-8 py-3',
                'font-semibold text-white transition-all duration-300 hover:from-purple-600',
                'hover:to-pink-700 hover:shadow-lg hover:shadow-purple-500/50'
              )}
            >
              ← Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
