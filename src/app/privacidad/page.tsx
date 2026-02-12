import Link from 'next/link';

export const metadata = {
  title: 'Política de Privacidad - ICFES Master',
  description: 'Política de privacidad de ICFES Master',
};

export default function PrivacidadPage() {
  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-black via-slate-950 to-black py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 sm:p-8 relative z-10">
        <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center gap-3">
          <span className="text-cyan-400">📄</span> Política de Privacidad
        </h1>
        <p className="text-gray-300 mb-8"><strong>ICFES Master</strong></p>
        <p className="text-sm text-gray-400 mb-8">Última actualización: 16 de diciembre de 2025</p>

        <div className="space-y-6">
          <p className="text-gray-200 leading-relaxed">
            En <strong className="text-cyan-400">ICFES Master</strong>, valoramos y respetamos la privacidad de nuestros usuarios. Esta Política de Privacidad explica cómo recopilamos, usamos y protegemos la información cuando utilizas nuestra aplicación y sitio web, enfocados en la preparación académica para el examen ICFES.
          </p>

          <div>
            <h2 className="text-2xl font-bold mt-8 mb-4 text-cyan-400">1. Información que recopilamos</h2>
            <p className="text-gray-300 mb-4">Podemos recopilar los siguientes datos:</p>
            <h3 className="text-xl font-semibold mt-6 mb-3 text-blue-400">a) Información proporcionada por el usuario</h3>
            <ul className="list-disc list-inside mb-4 space-y-2 text-gray-300">
              <li>Correo electrónico</li>
              <li>Nombre asociado a la cuenta de Google (si se usa ese método de registro)</li>
              <li>Apodo o nombre de usuario</li>
              <li>Información de autenticación (modo local en dispositivo)</li>
            </ul>
            <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 mb-6">
              <p className="text-gray-200"><strong className="text-blue-300">ICFES Master almacena datos localmente en tu dispositivo.</strong> En futuras versiones se implementará sincronización en la nube.</p>
            </div>
            <h3 className="text-xl font-semibold mt-6 mb-3 text-blue-400">b) Información de uso y progreso</h3>
            <ul className="list-disc list-inside mb-4 space-y-2 text-gray-300">
              <li>Progreso académico dentro de la app</li>
              <li>Resultados de preguntas (aciertos y errores)</li>
              <li>Rachas de estudio</li>
              <li>Estadísticas internas de uso</li>
            </ul>
            <h3 className="text-xl font-semibold mt-6 mb-3 text-blue-400">c) Información automática</h3>
            <ul className="list-disc list-inside mb-4 space-y-2 text-gray-300">
              <li>Datos anónimos de uso mediante <strong>Google Analytics</strong></li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mt-8 mb-4 text-cyan-400">2. Uso de la información</h2>
            <ul className="list-disc list-inside mb-6 space-y-2 text-gray-300">
              <li>Brindar y mejorar la experiencia educativa</li>
              <li>Guardar el progreso del usuario</li>
              <li>Mostrar estadísticas personalizadas</li>
              <li>Mejorar el rendimiento y contenido de la plataforma</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mt-8 mb-4 text-cyan-400">3. Servicios de terceros</h2>
            <ul className="list-disc list-inside mb-6 space-y-2 text-gray-300">
              <li><strong>LocalStorage del navegador</strong>: datos del usuario, progreso y preferencias</li>
              <li><strong>Google Analytics</strong>: análisis del uso de la plataforma</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mt-8 mb-4 text-cyan-400">4. Menores de edad</h2>
            <p className="text-gray-300 mb-6">ICFES Master es una plataforma educativa dirigida tanto a menores como a mayores de edad. No recopilamos intencionalmente información sensible.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mt-8 mb-4 text-cyan-400">5. Monetización</h2>
            <p className="text-gray-300 mb-6">La plataforma es <strong>gratuita</strong>. Los datos personales <strong>no se venden ni se comparten con fines comerciales</strong>.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mt-8 mb-4 text-cyan-400">6. Seguridad de la información</h2>
            <p className="text-gray-300 mb-6">Aplicamos medidas técnicas y organizativas razonables para proteger la información del usuario.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mt-8 mb-4 text-cyan-400">7. Derechos del usuario</h2>
            <p className="text-gray-300 mb-4">El usuario puede solicitar eliminación de su cuenta, consultar o actualizar su información. Contacto: <a href="mailto:fravelz@proton.me" className="text-cyan-400 hover:text-cyan-300 underline">fravelz@proton.me</a></p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mt-8 mb-4 text-cyan-400">8. Cambios en esta política</h2>
            <p className="text-gray-300 mb-6">Nos reservamos el derecho de actualizar esta Política de Privacidad.</p>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex justify-center">
            <Link href="/" className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50 flex items-center gap-2">
              ← Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
