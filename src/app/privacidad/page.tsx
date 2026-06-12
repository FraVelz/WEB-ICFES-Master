import { cn } from '@/utils/cn';
import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';
import { FULL_PAGE_SHELL_CLASS } from '@/shared/constants/pageShell';
import { LegalStructuredData } from '@/features/home/seo/PageStructuredData';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Política de Privacidad | ICFES Master' },
  description: 'Política de privacidad y tratamiento de datos en ICFES Master.',
  alternates: { canonical: '/privacidad/' },
  openGraph: {
    url: '/privacidad/',
    title: 'Política de Privacidad | ICFES Master',
    description: 'Política de privacidad y tratamiento de datos en ICFES Master.',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Política de Privacidad | ICFES Master',
    description: 'Política de privacidad y tratamiento de datos en ICFES Master.',
  },
};

export default function PrivacidadPage() {
  return (
    <>
      <LegalStructuredData
        title="Política de Privacidad"
        description="Política de privacidad y tratamiento de datos en ICFES Master."
        path="/privacidad/"
      />
      <a href="#main-content" className="skip-link">
        Saltar al contenido
      </a>
      <main id="main-content" className={cn('relative px-4 py-12 sm:px-6 lg:px-8', FULL_PAGE_SHELL_CLASS)}>
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
            'from-cta-text-start mb-4 flex items-center gap-3 bg-linear-to-r to-blue-500 bg-clip-text',
            'text-4xl font-bold text-transparent'
          )}
        >
          <Icon name="shield-alt" size="2xl" className="text-app-accent shrink-0" />
          Política de Privacidad
        </h1>
        <p className="text-on-surface-muted mb-8">
          <strong className="text-on-surface">ICFES Master</strong>
        </p>
        <p className="text-on-surface-muted mb-8 text-sm">Última actualización: 12 de junio de 2026</p>

        <div className="space-y-6">
          <p className="text-on-surface leading-relaxed">
            En <strong className="text-app-accent">ICFES Master</strong>, valoramos y respetamos la privacidad de
            nuestros usuarios. Esta Política de Privacidad explica cómo recopilamos, usamos y protegemos la información
            cuando utilizas nuestra aplicación y sitio web, enfocados en la preparación académica para el examen ICFES.
          </p>

          <div>
            <h2 className="text-app-accent mt-8 mb-4 text-2xl font-bold">1. Información que recopilamos</h2>
            <p className="text-on-surface-muted mb-4">Podemos recopilar los siguientes datos:</p>
            <h3 className="text-app-accent mt-6 mb-3 text-xl font-semibold">
              a) Información proporcionada por el usuario
            </h3>
            <ul className="text-on-surface-muted mb-4 list-inside list-disc space-y-2">
              <li>Correo electrónico</li>
              <li>Nombre asociado a la cuenta de Google (si se usa ese método de registro)</li>
              <li>Apodo o nombre de usuario</li>
              <li>Información de autenticación gestionada por Supabase (cuenta con email o Google)</li>
            </ul>
            <div className="border-app-ring/40 bg-app-ring/10 mb-6 rounded-lg border p-4">
              <p className="text-on-surface">
                <strong className="text-app-accent-strong">
                  Con cuenta, tu progreso y perfil se sincronizan en la nube (Supabase).
                </strong>{' '}
                El modo demo guarda datos solo en tu navegador hasta que crees una cuenta o cierres la sesión demo.
              </p>
            </div>
            <h3 className="text-app-accent mt-6 mb-3 text-xl font-semibold">b) Información de uso y progreso</h3>
            <ul className="text-on-surface-muted mb-4 list-inside list-disc space-y-2">
              <li>Progreso académico dentro de la app</li>
              <li>Resultados de preguntas (aciertos y errores)</li>
              <li>Rachas de estudio</li>
              <li>Estadísticas internas de uso</li>
            </ul>
            <h3 className="text-app-accent mt-6 mb-3 text-xl font-semibold">c) Información automática</h3>
            <ul className="text-on-surface-muted mb-4 list-inside list-disc space-y-2">
              <li>
                Datos agregados y anónimos de navegación mediante <strong>Vercel Web Analytics</strong> (páginas
                visitadas, origen del tráfico, dispositivo)
              </li>
              <li>
                Métricas de rendimiento (Web Vitals) mediante <strong>Vercel Speed Insights</strong>, sin identificar al
                usuario por nombre
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-app-accent mt-8 mb-4 text-2xl font-bold">2. Uso de la información</h2>
            <ul className="text-on-surface-muted mb-6 list-inside list-disc space-y-2">
              <li>Brindar y mejorar la experiencia educativa</li>
              <li>Guardar el progreso del usuario</li>
              <li>Mostrar estadísticas personalizadas</li>
              <li>Mejorar el rendimiento y contenido de la plataforma</li>
            </ul>
          </div>

          <div>
            <h2 className="text-app-accent mt-8 mb-4 text-2xl font-bold">3. Servicios de terceros</h2>
            <ul className="text-on-surface-muted mb-6 list-inside list-disc space-y-2">
              <li>
                <strong>Supabase</strong>: autenticación, perfil, progreso, gamificación y contenido de aprendizaje
              </li>
              <li>
                <strong>OpenAI</strong>: asistente educativo del chat (solo el texto de tus mensajes, con límites de
                uso)
              </li>
              <li>
                <strong>LocalStorage del navegador</strong>: preferencias, modo demo y caché local cuando aplica
              </li>
              <li>
                <strong>Vercel Web Analytics</strong>: análisis agregado del uso de la plataforma
              </li>
              <li>
                <strong>Vercel Speed Insights</strong>: medición de rendimiento y experiencia de carga
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-app-accent mt-8 mb-4 text-2xl font-bold">4. Menores de edad</h2>
            <p className="text-on-surface-muted mb-6">
              ICFES Master es una plataforma educativa dirigida tanto a menores como a mayores de edad. No recopilamos
              intencionalmente información sensible.
            </p>
          </div>

          <div>
            <h2 className="text-app-accent mt-8 mb-4 text-2xl font-bold">5. Monetización</h2>
            <p className="text-on-surface-muted mb-6">
              La plataforma es <strong>gratuita</strong>. Los datos personales{' '}
              <strong>no se venden ni se comparten con fines comerciales</strong>.
            </p>
          </div>

          <div>
            <h2 className="text-app-accent mt-8 mb-4 text-2xl font-bold">6. Seguridad de la información</h2>
            <p className="text-on-surface-muted mb-6">
              Aplicamos medidas técnicas y organizativas razonables para proteger la información del usuario.
            </p>
          </div>

          <div>
            <h2 className="text-app-accent mt-8 mb-4 text-2xl font-bold">7. Derechos del usuario</h2>
            <p className="text-on-surface-muted mb-4">
              El usuario puede solicitar eliminación de su cuenta, consultar o actualizar su información. Contacto:{' '}
              <a href="mailto:fravelz@proton.me" className="text-app-accent hover:text-app-accent-muted underline">
                fravelz@proton.me
              </a>
            </p>
          </div>

          <div>
            <h2 className="text-app-accent mt-8 mb-4 text-2xl font-bold">8. Cambios en esta política</h2>
            <p className="text-on-surface-muted mb-6">
              Nos reservamos el derecho de actualizar esta Política de Privacidad.
            </p>
          </div>

          <div className="border-surface-border mt-12 flex justify-center border-t pt-8">
            <Link
              href="/"
              className={cn(
                'from-cta-from to-cta-to flex items-center gap-2 rounded-lg bg-linear-to-r px-8 py-3',
                'hover:from-app-accent-strong font-semibold text-white transition-all duration-300 hover:to-blue-700',
                'hover:shadow-app-ring/50 hover:shadow-lg'
              )}
            >
              ← Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}
