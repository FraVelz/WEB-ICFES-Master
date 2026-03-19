import Link from 'next/link';

export const metadata = {
  title: 'Términos y Condiciones - ICFES Master',
  description: 'Términos y condiciones de ICFES Master',
};

export default function TerminosPage() {
  return (
    <div className="relative min-h-dvh bg-linear-to-b from-black via-slate-950 to-black px-4 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-1/3 left-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/3 h-96 w-96 animate-pulse rounded-full bg-purple-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-xl sm:p-8">
        <h1 className="mb-4 flex items-center gap-3 bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-4xl font-bold text-transparent">
          <span className="text-purple-400">📜</span> Términos y Condiciones
        </h1>
        <p className="mb-8 text-gray-300">
          <strong>ICFES Master</strong>
        </p>
        <p className="mb-8 text-sm text-gray-400">
          Última actualización: 16 de diciembre de 2025
        </p>

        <div className="space-y-6">
          <p className="leading-relaxed text-gray-200">
            Al acceder y utilizar{' '}
            <strong className="text-purple-400">ICFES Master</strong>, aceptas
            los siguientes Términos y Condiciones.
          </p>

          <div>
            <h2 className="mt-8 mb-4 text-2xl font-bold text-purple-400">
              1. Descripción del servicio
            </h2>
            <p className="mb-6 text-gray-300">
              ICFES Master es una plataforma educativa diseñada para apoyar la
              preparación del examen ICFES mediante práctica, seguimiento del
              progreso y estadísticas académicas.
            </p>
          </div>

          <div>
            <h2 className="mt-8 mb-4 text-2xl font-bold text-purple-400">
              2. Uso adecuado
            </h2>
            <ul className="mb-6 list-inside list-disc space-y-2 text-gray-300">
              <li>Usar la plataforma únicamente con fines educativos</li>
              <li>No realizar actividades fraudulentas o malintencionadas</li>
            </ul>
          </div>

          <div>
            <h2 className="mt-8 mb-4 text-2xl font-bold text-purple-400">
              3. Cuentas de usuario
            </h2>
            <p className="mb-6 text-gray-300">
              El usuario es responsable de mantener la confidencialidad de su
              cuenta y de toda actividad realizada desde ella.
            </p>
          </div>

          <div>
            <h2 className="mt-8 mb-4 text-2xl font-bold text-purple-400">
              4. Resultados académicos
            </h2>
            <div className="mb-6 rounded-lg border border-yellow-500/50 bg-yellow-500/20 p-4">
              <p className="text-gray-200">
                <strong className="text-yellow-300">
                  No garantiza resultados específicos en el examen ICFES
                </strong>
                , ya que dependen de múltiples factores.
              </p>
            </div>
          </div>

          <div>
            <h2 className="mt-8 mb-4 text-2xl font-bold text-purple-400">
              5. Disponibilidad del servicio
            </h2>
            <p className="mb-6 text-gray-300">
              El servicio puede ser modificado, suspendido o actualizado en
              cualquier momento.
            </p>
          </div>

          <div>
            <h2 className="mt-8 mb-4 text-2xl font-bold text-purple-400">
              6. Monetización
            </h2>
            <p className="mb-6 text-gray-300">
              La plataforma es 100% gratuita.
            </p>
          </div>

          <div>
            <h2 className="mt-8 mb-4 text-2xl font-bold text-purple-400">
              7. Propiedad intelectual
            </h2>
            <p className="mb-6 text-gray-300">
              Todo el contenido de ICFES Master pertenece a sus desarrolladores.
            </p>
          </div>

          <div>
            <h2 className="mt-8 mb-4 text-2xl font-bold text-purple-400">
              8. Limitación de responsabilidad
            </h2>
            <ul className="mb-6 list-inside list-disc space-y-2 text-gray-300">
              <li>Resultados académicos obtenidos por el usuario</li>
              <li>Uso indebido de la plataforma</li>
              <li>Interrupciones temporales del servicio</li>
            </ul>
          </div>

          <div>
            <h2 className="mt-8 mb-4 text-2xl font-bold text-purple-400">
              9. Legislación aplicable
            </h2>
            <p className="mb-6 text-gray-300">
              Estos términos se rigen por las leyes de la{' '}
              <strong>República de Colombia</strong>.
            </p>
          </div>

          <div>
            <h2 className="mt-8 mb-4 text-2xl font-bold text-purple-400">
              10. Contacto
            </h2>
            <p className="mb-6 text-gray-300">
              <a
                href="mailto:fravelz@proton.me"
                className="text-purple-400 underline hover:text-purple-300"
              >
                fravelz@proton.me
              </a>
            </p>
          </div>

          <div className="mt-12 flex justify-center border-t border-white/10 pt-8">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg bg-linear-to-r from-purple-500 to-pink-600 px-8 py-3 font-semibold text-white transition-all duration-300 hover:from-purple-600 hover:to-pink-700 hover:shadow-lg hover:shadow-purple-500/50"
            >
              ← Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
