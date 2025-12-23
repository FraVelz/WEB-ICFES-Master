import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faScroll, faArrowLeft, faTriangleExclamation, faEnvelope } from '@fortawesome/free-solid-svg-icons';



export const Terminos = () => {
    return (
        <div className="min-h-[100dvh] bg-gradient-to-b from-black via-slate-950 to-black py-12 px-4 sm:px-6 lg:px-8 relative">
            {/* Background glow effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            </div>

            <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-43 sm:p-8 relative z-10">
                <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 flex items-center gap-3">
                    <FontAwesomeIcon icon={faScroll} className="text-purple-400" />
                    Términos y Condiciones
                </h1>
                <p className="text-gray-300 mb-8">
                    <strong>ICFES Master</strong>
                </p>
                <p className="text-sm text-gray-400 mb-8">
                    Última actualización: 16 de diciembre de 2025
                </p>

                <div className="space-y-6">
                    <p className="text-gray-200 leading-relaxed">
                        Al acceder y utilizar <strong className="text-purple-400">ICFES Master</strong>, aceptas los siguientes Términos y Condiciones. Si no estás de acuerdo, debes abstenerte de usar la plataforma.
                    </p>

                    <div>
                        <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-400">1. Descripción del servicio</h2>
                        <p className="text-gray-300 mb-6">
                            ICFES Master es una plataforma educativa diseñada para apoyar la preparación del examen ICFES mediante práctica, seguimiento del progreso y estadísticas académicas.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-400">2. Uso adecuado</h2>
                        <p className="text-gray-300 mb-4">El usuario se compromete a:</p>
                        <ul className="list-disc list-inside mb-6 space-y-2 text-gray-300">
                            <li>Usar la plataforma únicamente con fines educativos</li>
                            <li>No realizar actividades fraudulentas o malintencionadas</li>
                            <li>No intentar acceder a sistemas o datos no autorizados</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-400">3. Cuentas de usuario</h2>
                        <p className="text-gray-300 mb-4">El usuario es responsable de:</p>
                        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-300">
                            <li>Mantener la confidencialidad de su cuenta</li>
                            <li>Toda actividad realizada desde su cuenta</li>
                        </ul>
                        <p className="text-gray-300 mb-6">
                            ICFES Master se reserva el derecho de suspender cuentas que incumplan estos términos.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-400">4. Resultados académicos</h2>
                        <p className="text-gray-300 mb-4">
                            ICFES Master es una <strong>herramienta de apoyo educativo</strong>.
                        </p>
                        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-6">
                            <p className="text-gray-200 flex items-start gap-2">
                                <FontAwesomeIcon icon={faTriangleExclamation} className="text-yellow-400 mt-1 flex-shrink-0" />
                                <span><strong className="text-yellow-300">No garantiza resultados específicos en el examen ICFES</strong>, ya que estos dependen de múltiples factores, incluyendo la constancia, el esfuerzo y la preparación individual del usuario.</span>
                            </p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-400">5. Disponibilidad del servicio</h2>
                        <p className="text-gray-300 mb-6">
                            El servicio puede ser modificado, suspendido o actualizado en cualquier momento sin previo aviso, con el objetivo de mejorar la experiencia del usuario.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-400">6. Monetización</h2>

                        <p className="text-gray-300 mb-4">La plataforma es 100% gratuita.</p>

                        {/* <p className="text-gray-300 mb-4">Algunas funciones son premium o pro (no afectan el acceso a ninguna de las funcionalidades de la Web).</p>
                        <p className="text-gray-300 mb-6">Las donaciones o pagos serán <strong>voluntarios</strong> y claramente informados al usuario.</p> */}
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-400">7. Propiedad intelectual</h2>
                        <p className="text-gray-300 mb-6">
                            Todo el contenido, diseño y funcionalidad de ICFES Master pertenece a sus desarrolladores y no puede ser copiado, distribuido o reutilizado sin autorización.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-400">8. Limitación de responsabilidad</h2>
                        <p className="text-gray-300 mb-4">ICFES Master no se hace responsable por:</p>
                        <ul className="list-disc list-inside mb-6 space-y-2 text-gray-300">
                            <li>Resultados académicos obtenidos por el usuario</li>
                            <li>Uso indebido de la plataforma</li>
                            <li>Interrupciones temporales del servicio</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-400">9. Legislación aplicable</h2>
                        <p className="text-gray-300 mb-6">
                            Estos términos se rigen por las leyes de la <strong>República de Colombia</strong>.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-400">10. Contacto</h2>
                        <p className="text-gray-300 mb-6 flex items-center gap-2">
                            <FontAwesomeIcon icon={faEnvelope} className="text-purple-400" />
                            <a href="mailto:fravelz@proton.me" className="text-purple-400 hover:text-purple-300 transition-colors underline">fravelz@proton.me</a>
                        </p>
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/10 flex justify-center">
                        <a
                            href="/"
                            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 flex items-center gap-2"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
                            Volver al Inicio
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
