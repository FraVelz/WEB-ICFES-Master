import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faRocket, faEye, faEyeSlash, faExclamationCircle, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/context/AuthContext';
import { GoogleSignInButton } from '@/shared/components/atoms/GoogleSignInButton';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener el estado anterior (dónde viene)
  const from = location.state?.from;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      
      // Si viene desde pricing, guardar flag y redirigir a home
      if (from === 'pricing') {
        localStorage.setItem('fromPricing', 'true');
        navigate('/', { replace: true });
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-linear-to-b from-black via-slate-950 to-black text-white flex flex-col px-6 overflow-hidden">
      {/* Background glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Header Mobile - Solo visible en móvil */}
      <div className="relative z-10">
        <div className="flex items-center justify-between py-4">
          <Link
            to="/"
            className="text-slate-400 hover:text-slate-300 transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} className="text-2xl" />
          </Link>
          <h2 className="text-lg font-semibold">Ingresa tus datos</h2>
          <div className="w-6"></div>
        </div>
        <div className="h-px bg-linear-to-r from-transparent via-slate-700 to-transparent"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-r from-cyan-500 to-blue-600 mb-4">
            <FontAwesomeIcon icon={faRocket} className="text-2xl" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-2 bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            ICFES Master
          </h1>
          <p className="text-slate-400">Prepárate para dominar el ICFES</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Email
            </label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-2">
              Contraseña
            </label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <FontAwesomeIcon icon={faExclamationCircle} className="text-red-400 mt-0.5 shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="cursor-pointer w-full py-3 px-4 bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Iniciando sesión...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faRocket} />
                Iniciar Sesión
              </>
            )}
          </button>
        </form>

        {/* Google Sign-In */}
        <GoogleSignInButton />

        {/* Links */}
        <div className="mt-6 space-y-4">
          {/* Forgot Password Link */}
          <p className="text-center">
            <Link
              to="/forgot-password"
              className="text-slate-400 text-sm hover:text-slate-300 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </p>
        </div>
        </div>
      </div>

      {/* Legal Links Footer - Pegado al final */}
      <div className="relative z-10 w-full py-4 border-t border-slate-700/50 mt-auto">
        <div className="max-w-md mx-auto">
          <p className="text-center text-slate-500 text-xs mb-3">
            Al registrarte, aceptas nuestros términos de servicio
          </p>
          <div className="flex items-center justify-center gap-4 text-xs">
            <a href="/privacidad" className="text-slate-400 hover:text-slate-300 transition-colors">Política de Privacidad</a>
            <span className="text-slate-600">|</span>
            <a href="/terminos" className="text-slate-400 hover:text-slate-300 transition-colors">Términos y Condiciones</a>
          </div>
        </div>
      </div>
    </div>
  );
};
